import { describe, it, expect } from 'vitest';
import { groupPeople } from './grouping';
import { Person } from '../types';

const people: Person[] = [
  { id: 1, name: 'A', jobTitle: 'Dev', country: 'USA', salary: 0, currency: 'USD', employment: 'employee', status: 'active', photo: '' },
  { id: 2, name: 'B', jobTitle: 'PM', country: 'Germany', salary: 0, currency: 'EUR', employment: 'contractor', status: 'onboarding', photo: '' },
  { id: 3, name: 'C', jobTitle: 'QA', country: 'USA', salary: 0, currency: 'USD', employment: 'employee', status: 'active', photo: '' },
];

describe('groupPeople', () => {
  it('returns single group for none', () => {
    const groups = groupPeople(people, 'none');
    expect(groups).toHaveLength(1);
    expect(groups[0].people).toHaveLength(3);
  });

  it('groups by country', () => {
    const groups = groupPeople(people, 'country');
    expect(groups).toHaveLength(2);
    const usa = groups.find((g) => g.key === 'USA');
    expect(usa?.people).toHaveLength(2);
  });

  it('groups by status', () => {
    const groups = groupPeople(people, 'status');
    expect(groups).toHaveLength(2);
  });

  it('groups by role (employment)', () => {
    const groups = groupPeople(people, 'role');
    const employees = groups.find((g) => g.key === 'employee');
    expect(employees?.people).toHaveLength(2);
  });

  it('groups by jobTitle', () => {
    const groups = groupPeople(people, 'jobTitle');
    expect(groups).toHaveLength(3);
    const devGroup = groups.find((g) => g.key === 'Dev');
    expect(devGroup?.people).toHaveLength(1);
    expect(devGroup?.label).toBe('Dev');
  });

  it('sorts group keys alphabetically', () => {
    const groups = groupPeople(people, 'country');
    expect(groups[0].key).toBe('Germany');
    expect(groups[1].key).toBe('USA');
  });
});
