import { Person, PeopleQuery, PeopleResponse } from '../types';

const BASE_URL = 'http://localhost:4002';

/**
 * Builds a URLSearchParams object from a PeopleQuery.
 *
 * json-server 0.17 supports:
 *  - `_page` / `_limit` for pagination
 *  - `_sort` / `_order` for sorting
 *  - `q` for full-text search across all string fields
 *  - repeated params for OR filtering (e.g. status=active&status=onboarding)
 */
export function buildQueryParams(query: PeopleQuery): URLSearchParams {
  const params = new URLSearchParams();

  if (query.page) params.set('_page', String(query.page));
  params.set('_limit', String(query.limit ?? 20));

  if (query.search) params.set('q', query.search);

  // json-server 0.17 _like uses regex — join multiple statuses with | for OR matching
  if (query.status && query.status.length > 0) {
    params.set('status_like', query.status.join('|'));
  }

  if (query.country) params.set('country', query.country);
  if (query.role) params.set('employment', query.role);

  if (query.sortBy && query.order) {
    params.set('_sort', query.sortBy);
    params.set('_order', query.order);
  }

  if (query.salaryCurrency) params.set('currency', query.salaryCurrency);
  if (query.salaryMin) params.set('salary_gte', String(query.salaryMin));
  if (query.salaryMax) params.set('salary_lte', String(query.salaryMax));

  return params;
}

export async function fetchPeople(query: PeopleQuery): Promise<PeopleResponse> {
  const params = buildQueryParams(query);
  const url = `${BASE_URL}/people?${params.toString()}`;

  const response = await fetch(url, { method: 'GET' });

  if (!response.ok) {
    throw new Error(`Failed to fetch people: ${response.status} ${response.statusText}`);
  }

  // json-server exposes total count in this header
  const total = parseInt(response.headers.get('X-Total-Count') ?? '0', 10);
  const data: Person[] = await response.json();
  const limit = query.limit ?? 20;
  const page = query.page ?? 1;

  return {
    data,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function fetchStatusCount(status: string | null): Promise<number> {
  const params = new URLSearchParams({ _limit: '1' });
  if (status) params.set('status', status);
  const res = await fetch(`${BASE_URL}/people?${params}`);
  if (!res.ok) throw new Error('Failed to fetch count');
  return parseInt(res.headers.get('X-Total-Count') ?? '0', 10);
}

export async function fetchSalaryBounds(currency: string | null): Promise<{ min: number; max: number }> {
  const base = currency ? `currency=${currency}&` : '';
  const [minRes, maxRes] = await Promise.all([
    fetch(`${BASE_URL}/people?${base}_sort=salary&_order=asc&_limit=1`),
    fetch(`${BASE_URL}/people?${base}_sort=salary&_order=desc&_limit=1`),
  ]);
  const [minData, maxData]: [Person[], Person[]] = await Promise.all([minRes.json(), maxRes.json()]);
  return { min: minData[0]?.salary ?? 0, max: maxData[0]?.salary ?? 0 };
}

export async function exportAllPeople(query: Omit<PeopleQuery, 'page' | 'limit'>): Promise<Person[]> {
  const params = buildQueryParams({ ...query, page: 1, limit: 10000 });
  params.delete('_page');
  params.set('_limit', '10000');
  const response = await fetch(`${BASE_URL}/people?${params.toString()}`);
  if (!response.ok) throw new Error(`Export failed: ${response.status}`);
  return response.json();
}

export async function createPerson(
  person: Omit<Person, 'id'>
): Promise<Person> {
  const response = await fetch(`${BASE_URL}/people`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(person),
  });

  if (!response.ok) {
    throw new Error(`Failed to create person: ${response.status}`);
  }

  return response.json();
}

