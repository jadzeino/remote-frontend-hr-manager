import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchPeople, buildQueryParams, createPerson } from './peopleApi';
import { Person } from '../types';

const mockPerson: Person = {
  id: 1,
  name: 'Jane Smith',
  jobTitle: 'Engineer',
  country: 'USA',
  salary: 10000000,
  currency: 'USD',
  employment: 'employee',
  status: 'active',
  photo: '',
};

const makeFetchMock = (data: unknown, total = 1) =>
  vi.fn().mockResolvedValue({
    ok: true,
    headers: { get: (h: string) => (h === 'X-Total-Count' ? String(total) : null) },
    json: async () => data,
  });

describe('buildQueryParams', () => {
  it('sets _page and _limit', () => {
    const params = buildQueryParams({ page: 2, limit: 10 });
    expect(params.get('_page')).toBe('2');
    expect(params.get('_limit')).toBe('10');
  });

  it('maps search to q', () => {
    const params = buildQueryParams({ search: 'john' });
    expect(params.get('q')).toBe('john');
  });

  it('joins multiple status values with | for regex OR', () => {
    const params = buildQueryParams({ status: ['active', 'onboarding'] });
    expect(params.get('status_like')).toBe('active|onboarding');
  });

  it('uses status_like for single status too', () => {
    const params = buildQueryParams({ status: ['active'] });
    expect(params.get('status_like')).toBe('active');
  });

  it('maps role to employment', () => {
    const params = buildQueryParams({ role: 'contractor' });
    expect(params.get('employment')).toBe('contractor');
  });

  it('sets sort and order', () => {
    const params = buildQueryParams({ sortBy: 'name', order: 'asc' });
    expect(params.get('_sort')).toBe('name');
    expect(params.get('_order')).toBe('asc');
  });

  it('omits sort when no sortBy', () => {
    const params = buildQueryParams({ order: 'desc' });
    expect(params.has('_sort')).toBe(false);
  });
});

describe('fetchPeople', () => {
  beforeEach(() => {
    global.fetch = makeFetchMock([mockPerson], 1);
  });

  it('returns data with total and totalPages', async () => {
    const result = await fetchPeople({ page: 1, limit: 20 });
    expect(result.data).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.totalPages).toBe(1);
  });

  it('throws on non-ok response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });
    await expect(fetchPeople({})).rejects.toThrow('Failed to fetch people');
  });
});

describe('createPerson', () => {
  it('POSTs and returns the created person', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ...mockPerson, id: 99 }),
    });
    const created = await createPerson(mockPerson);
    expect(created.id).toBe(99);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/people'),
      expect.objectContaining({ method: 'POST' })
    );
  });
});
