import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPeople } from '../services/peopleApi';
import { PeopleFiltersState, PeopleQuery, PeopleResponse } from '../types';

function filtersToBaseQuery(filters: PeopleFiltersState): Omit<PeopleQuery, 'page'> {
  return {
    limit: filters.limit,
    search: filters.search || undefined,
    status: filters.status.length > 0 ? filters.status : undefined,
    country: filters.country || undefined,
    role: filters.role || undefined,
    sortBy: filters.sortBy || undefined,
    order: filters.order === 'none' ? undefined : filters.order,
  };
}

export function usePeopleInfinite(filters: PeopleFiltersState) {
  const baseQuery = filtersToBaseQuery(filters);

  return useInfiniteQuery<PeopleResponse>({
    queryKey: ['people-infinite', baseQuery],
    queryFn: ({ pageParam }) =>
      fetchPeople({ ...baseQuery, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: 2,
  });
}
