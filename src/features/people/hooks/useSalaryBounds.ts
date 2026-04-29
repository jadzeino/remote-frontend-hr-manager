import { useQuery } from '@tanstack/react-query';
import { fetchSalaryBounds } from '../services/peopleApi';

export function useSalaryBounds(currency: string | null) {
  const { data, isLoading } = useQuery({
    queryKey: ['salaryBounds', currency ?? 'all'],
    queryFn: () => fetchSalaryBounds(currency),
    staleTime: 5 * 60_000,
    gcTime: 15 * 60_000,
  });
  return { bounds: data ?? { min: 0, max: 0 }, isLoading };
}
