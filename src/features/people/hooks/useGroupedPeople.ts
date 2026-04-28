import { useMemo } from 'react';
import { GroupedPeople, groupPeople } from '../utils/grouping';
import { Person, GroupBy } from '../types';

export function useGroupedPeople(people: Person[], groupBy: GroupBy): GroupedPeople[] {
  return useMemo(() => groupPeople(people, groupBy), [people, groupBy]);
}
