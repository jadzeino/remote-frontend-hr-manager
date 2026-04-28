import { Person, GroupBy } from '../types';

export type GroupedPeople = {
  key: string;
  label: string;
  people: Person[];
};

function getGroupKey(person: Person, groupBy: GroupBy): string {
  switch (groupBy) {
    case 'country':
      return person.country;
    case 'status':
      return person.status;
    case 'role':
      return person.employment;
    case 'jobTitle':
      return person.jobTitle;
    default:
      return '';
  }
}

export function groupPeople(people: Person[], groupBy: GroupBy): GroupedPeople[] {
  if (groupBy === 'none') {
    return [{ key: 'all', label: '', people }];
  }

  const map = new Map<string, Person[]>();

  for (const person of people) {
    const key = getGroupKey(person, groupBy);
    const existing = map.get(key);
    if (existing) {
      existing.push(person);
    } else {
      map.set(key, [person]);
    }
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, members]) => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      people: members,
    }));
}
