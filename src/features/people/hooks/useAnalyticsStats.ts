import { useQuery } from '@tanstack/react-query';
import { fetchStatusCount } from '../services/peopleApi';

export type AnalyticsStats = {
  total: number;
  active: number;
  onboarding: number;
  offboarded: number;
};

const STALE = 5 * 60_000;
const GC = 15 * 60_000;

export function useAnalyticsStats(): {
  stats: AnalyticsStats;
  isLoading: boolean;
} {
  const total = useQuery({
    queryKey: ['stats', 'total'],
    queryFn: () => fetchStatusCount(null),
    staleTime: STALE,
    gcTime: GC,
  });

  const active = useQuery({
    queryKey: ['stats', 'active'],
    queryFn: () => fetchStatusCount('active'),
    staleTime: STALE,
    gcTime: GC,
  });

  const onboarding = useQuery({
    queryKey: ['stats', 'onboarding'],
    queryFn: () => fetchStatusCount('onboarding'),
    staleTime: STALE,
    gcTime: GC,
  });

  const offboarded = useQuery({
    queryKey: ['stats', 'offboarded'],
    queryFn: () => fetchStatusCount('offboarded'),
    staleTime: STALE,
    gcTime: GC,
  });

  return {
    stats: {
      total: total.data ?? 0,
      active: active.data ?? 0,
      onboarding: onboarding.data ?? 0,
      offboarded: offboarded.data ?? 0,
    },
    isLoading: total.isLoading || active.isLoading || onboarding.isLoading || offboarded.isLoading,
  };
}
