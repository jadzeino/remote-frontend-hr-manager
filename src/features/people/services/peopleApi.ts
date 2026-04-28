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

  if (query.status && query.status.length > 0) {
    for (const s of query.status) {
      params.append('status', s);
    }
  }

  if (query.country) params.set('country', query.country);
  if (query.role) params.set('employment', query.role);

  if (query.sortBy && query.order) {
    params.set('_sort', query.sortBy);
    params.set('_order', query.order);
  }

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

export async function fetchCountries(): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/people?_limit=500`);
  if (!response.ok) throw new Error('Failed to fetch countries');
  const data: Person[] = await response.json();
  return [...new Set(data.map((p) => p.country))].sort();
}
