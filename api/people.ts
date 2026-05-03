import { faker } from '@faker-js/faker';
import type { IncomingMessage, ServerResponse } from 'http';

interface Person {
  id: number;
  name: string;
  jobTitle: string;
  country: string;
  salary: number;
  currency: string;
  employment: string;
  status: string;
  photo: string | null;
}

const JOB_TITLES = [
  'Account Manager', 'AI Engineer', 'Backend Developer', 'Business Analyst',
  'CEO', 'CFO', 'Cloud Engineer', 'Content Writer', 'CTO', 'Customer Success',
  'Data Scientist', 'Database Administrator', 'DevOps Engineer', 'Executive Assistant',
  'Finance Analyst', 'Frontend Developer', 'Full Stack Developer', 'Game Developer',
  'Graphic Designer', 'HR Manager', 'Legal Counsel', 'Marketing Manager',
  'ML Engineer', 'Mobile Developer', 'Operations Manager', 'Pianist',
  'Product Designer', 'Product Manager', 'Product Owner', 'Project Manager',
  'QA Engineer', 'Recruiter', 'Scrum Master', 'Security Engineer', 'SEO Specialist',
  'Social Media Manager', 'Software Engineer', 'Solutions Architect', 'Support Engineer',
  'System Administrator', 'Technical Writer', 'UI Designer', 'UX Researcher',
];

const COUNTRIES = [
  'Argentina', 'Australia', 'Austria', 'Belgium', 'Brazil', 'Canada', 'Chile',
  'China', 'Czech Republic', 'Denmark', 'Finland', 'France', 'Germany', 'Greece',
  'India', 'Ireland', 'Italy', 'Japan', 'Mexico', 'Netherlands', 'New Zealand',
  'Norway', 'Poland', 'Portugal', 'Romania', 'Singapore', 'South Africa',
  'South Korea', 'Spain', 'Sweden', 'Switzerland', 'UAE', 'United Kingdom', 'United States',
];

const CURRENCIES = ['EUR', 'USD', 'GBP'];
const EMPLOYMENT_TYPES = ['contractor', 'employee'];

// Generated once per Lambda instance with a fixed seed → stable across requests
let _db: Person[] | null = null;

function getDb(): Person[] {
  if (_db) return _db;

  faker.seed(42);

  _db = Array.from({ length: 482 }, (_, i) => {
    const id = i + 1;
    const name = faker.person.fullName();

    const statusRoll = faker.number.int({ min: 1, max: 100 });
    const status = statusRoll <= 80 ? 'active' : statusRoll <= 95 ? 'onboarding' : 'offboarded';

    const stepCount = (250000 - 40000) / 50; // 4200 steps
    const baseAmount = 40000 + faker.number.int({ min: 0, max: stepCount }) * 50;
    const cents = faker.helpers.arrayElement([0, 50, 98]);
    const salary = baseAmount * 100 + cents;

    const hasPhoto = id <= 100 || faker.number.int({ min: 1, max: 10 }) <= 9;
    const photo = hasPhoto
      ? `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${encodeURIComponent(name)}-${id}`
      : null;

    return {
      id,
      name,
      jobTitle: faker.helpers.arrayElement(JOB_TITLES),
      country: faker.helpers.arrayElement(COUNTRIES),
      salary,
      currency: faker.helpers.arrayElement(CURRENCIES),
      employment: faker.helpers.arrayElement(EMPLOYMENT_TYPES),
      status,
      photo,
    };
  });

  return _db;
}

function fullTextMatch(person: Person, q: string): boolean {
  const search = q.toLowerCase();
  return Object.values(person).some(
    (v) => v !== null && String(v).toLowerCase().includes(search),
  );
}

export default function handler(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url ?? '/', `http://${req.headers.host}`);
  const p = url.searchParams;

  let results = [...getDb()];

  // Full-text search (same as json-server `q`)
  const q = p.get('q');
  if (q) results = results.filter((person) => fullTextMatch(person, q));

  // Status — regex OR (status_like=active|onboarding) or exact (status=active)
  const statusLike = p.get('status_like');
  const statusExact = p.get('status');
  if (statusLike) {
    const re = new RegExp(statusLike, 'i');
    results = results.filter((person) => re.test(person.status));
  } else if (statusExact) {
    results = results.filter((person) => person.status === statusExact);
  }

  // Exact filters
  const country = p.get('country');
  if (country) results = results.filter((person) => person.country === country);

  const employment = p.get('employment');
  if (employment) results = results.filter((person) => person.employment === employment);

  const currency = p.get('currency');
  if (currency) results = results.filter((person) => person.currency === currency);

  // Salary range
  const salaryGte = p.get('salary_gte');
  if (salaryGte) results = results.filter((person) => person.salary >= Number(salaryGte));

  const salaryLte = p.get('salary_lte');
  if (salaryLte) results = results.filter((person) => person.salary <= Number(salaryLte));

  const total = results.length;

  // Sorting
  const sortBy = p.get('_sort') as keyof Person | null;
  const order = p.get('_order');
  if (sortBy) {
    const dir = order === 'desc' ? -1 : 1;
    results.sort((a, b) => {
      const av = a[sortBy];
      const bv = b[sortBy];
      if (av === null || av === undefined) return 1;
      if (bv === null || bv === undefined) return -1;
      return av < bv ? -dir : av > bv ? dir : 0;
    });
  }

  // Pagination
  const page = Math.max(1, parseInt(p.get('_page') ?? '1', 10));
  const limit = Math.max(1, parseInt(p.get('_limit') ?? '20', 10));
  const start = (page - 1) * limit;
  const pageData = results.slice(start, start + limit);

  const body = JSON.stringify(pageData);

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('X-Total-Count', String(total));
  res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
  res.writeHead(200);
  res.end(body);
}
