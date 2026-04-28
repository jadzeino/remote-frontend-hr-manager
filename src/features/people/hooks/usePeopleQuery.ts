import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
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
  const queryClient = useQueryClient();
  const query = filtersToQuery(filters);

  const result = useQuery<PeopleResponse>({
    queryKey: peopleQueryKey(query),
    queryFn: () => fetchPeople(query),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: 2,
  });

  // Prefetch the next page so pagination feels instant
  useEffect(() => {
    if (result.data && filters.page < result.data.totalPages) {
      const nextQuery = { ...query, page: filters.page + 1 };
      queryClient.prefetchQuery({
        queryKey: peopleQueryKey(nextQuery),
        queryFn: () => fetchPeople(nextQuery),
        staleTime: 30_000,
      });
    }
  }, [result.data, filters.page, query, queryClient]);

  return result;
}
