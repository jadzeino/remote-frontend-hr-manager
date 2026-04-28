import fs from 'fs';
import { faker } from '@faker-js/faker';

const jobTitles = [
  'Account Manager',
  'AI Engineer',
  'Backend Developer',
  'Business Analyst',
  'CEO',
  'CFO',
  'Cloud Engineer',
  'Content Writer',
  'CTO',
  'Customer Success',
  'Data Scientist',
  'Database Administrator',
  'DevOps Engineer',
  'Executive Assistant',
  'Finance Analyst',
  'Frontend Developer',
  'Full Stack Developer',
  'Game Developer',
  'Graphic Designer',
  'HR Manager',
  'Legal Counsel',
  'Marketing Manager',
  'ML Engineer',
  'Mobile Developer',
  'Operations Manager',
  'Pianist',
  'Product Designer',
  'Product Manager',
  'Product Owner',
  'Project Manager',
  'QA Engineer',
  'Recruiter',
  'Scrum Master',
  'Security Engineer',
  'SEO Specialist',
  'Social Media Manager',
  'Software Engineer',
  'Solutions Architect',
  'Support Engineer',
  'System Administrator',
  'Technical Writer',
  'UI Designer',
  'UX Researcher',
];

const countries = [
  'Argentina',
  'Australia',
  'Austria',
  'Belgium',
  'Brazil',
  'Canada',
  'Chile',
  'China',
  'Czech Republic',
  'Denmark',
  'Finland',
  'France',
  'Germany',
  'Greece',
  'India',
  'Ireland',
  'Italy',
  'Japan',
  'Mexico',
  'Netherlands',
  'New Zealand',
  'Norway',
  'Poland',
  'Portugal',
  'Romania',
  'Singapore',
  'South Africa',
  'South Korea',
  'Spain',
  'Sweden',
  'Switzerland',
  'UAE',
  'United Kingdom',
  'United States',
];

const employmentTypes = ['contractor', 'employee'];

const currencies = ['EUR', 'USD', 'GBP'];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateSalary() {
  const min = 40000;
  const max = 250000;
  const step = 50;
  const steps = (max - min) / step;
  const baseSalary = min + Math.floor(Math.random() * (steps + 1)) * step;

  const centsOptions = [0, 50, 98];
  const cents = centsOptions[Math.floor(Math.random() * centsOptions.length)];

  // Return salary in cents format (e.g., 400050 for $4000.50)
  return baseSalary * 100 + cents;
}

function getWeightedStatus() {
  // 80% active, 15% onboarding, 5% offboarded
  const rand = Math.random() * 100;
  if (rand < 80) return 'active';
  if (rand < 95) return 'onboarding';
  return 'offboarded';
}

function hasPhoto(index) {
  if (index < 100) return true; // For testing purposes, don't change.

  // After that, most chance of having a photo
  return Math.random() < 0.9;
}

function generatePhoto(name, id) {
  if (!hasPhoto(id)) return null;

  const seed = `${name}-${id}`;
  return `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${seed}`;
}

const people = [];
for (let i = 1; i <= 482; i++) {
  const country = getRandomElement(countries);
  const name = faker.person.fullName();

  people.push({
    id: i,
    name: name,
    jobTitle: getRandomElement(jobTitles),
    country: country,
    salary: generateSalary(),
    currency: getRandomElement(currencies),
    employment: getRandomElement(employmentTypes),
    status: getWeightedStatus(),
    photo: generatePhoto(name, i),
  });
}

const data = { people };

fs.writeFileSync('server.json', JSON.stringify(data, null, 2));
console.log('Generated 500 members in server.json');
