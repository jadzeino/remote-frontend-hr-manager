import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchPeople } from '../services/peopleApi';
import { PeopleFiltersState, PeopleQuery, PeopleResponse } from '../types';

function filtersToQuery(filters: PeopleFiltersState): PeopleQuery {
  return {
    page: filters.page,
    limit: filters.limit,
    search: filters.search || undefined,
    status: filters.status.length > 0 ? filters.status : undefined,
    country: filters.country || undefined,
    role: filters.role || undefined,
    sortBy: filters.sortBy || undefined,
    order: filters.order === 'none' ? undefined : filters.order,
  };
}

export function peopleQueryKey(query: PeopleQuery) {
  return ['people', query] as const;
}

export function usePeopleQuery(filters: PeopleFiltersState) {
  const query = filtersToQuery(filters);

  return useQuery<PeopleResponse>({
    queryKey: peopleQueryKey(query),
    queryFn: () => fetchPeople(query),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: 2,
  });
}
