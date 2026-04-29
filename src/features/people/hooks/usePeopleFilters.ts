import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { sanitizeInput } from '../utils/sanitize';
import { GroupBy, PeopleFiltersState, ViewMode } from '../types';
import { DEFAULT_LIMIT } from '../constants';

function parseStatus(raw: string | null): string[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function usePeopleFilters(): {
  filters: PeopleFiltersState;
  setSearch: (v: string) => void;
  toggleStatus: (status: string) => void;
  setCountry: (v: string) => void;
  setRole: (v: string) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSortBy: (column: string, order: 'asc' | 'desc' | 'none') => void;
  setGroupBy: (g: GroupBy) => void;
  setViewMode: (m: ViewMode) => void;
  applySalaryFilter: (min: number, max: number, currency: string) => void;
  clearSalaryFilter: () => void;
  clearAllFilters: () => void;
} {
  const [params, setParams] = useSearchParams();

  const filters: PeopleFiltersState = {
    search: params.get('search') ?? '',
    status: parseStatus(params.get('status')),
    country: params.get('country') ?? '',
    role: params.get('role') ?? '',
    page: parseInt(params.get('page') ?? '1', 10),
    limit: parseInt(params.get('limit') ?? String(DEFAULT_LIMIT), 10),
    sortBy: params.get('sortBy') ?? '',
    order: (params.get('order') as PeopleFiltersState['order']) ?? 'none',
    groupBy: (params.get('groupBy') as GroupBy) ?? 'none',
    viewMode: (params.get('viewMode') as ViewMode) ?? 'pagination',
    salaryMin: parseInt(params.get('salaryMin') ?? '0', 10),
    salaryMax: parseInt(params.get('salaryMax') ?? '0', 10),
    salaryCurrency: params.get('salaryCurrency') ?? '',
  };

  const update = useCallback(
    (updates: Record<string, string>, replace = false) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [key, val] of Object.entries(updates)) {
            if (val === '' || val === 'none') {
              next.delete(key);
            } else {
              next.set(key, val);
            }
          }
          return next;
        },
        { replace }
      );
    },
    [setParams]
  );

  const setSearch = useCallback(
    (v: string) => update({ search: sanitizeInput(v), page: '1' }),
    [update]
  );

  const toggleStatus = useCallback(
    (status: string) => {
      const current = parseStatus(params.get('status'));
      const next = current.includes(status)
        ? current.filter((s) => s !== status)
        : [...current, status];
      update({ status: next.join(','), page: '1' });
    },
    [params, update]
  );

  const setCountry = useCallback(
    (v: string) => update({ country: v, page: '1' }),
    [update]
  );

  const setRole = useCallback(
    (v: string) => update({ role: v, page: '1' }),
    [update]
  );

  const setPage = useCallback(
    (page: number) => update({ page: String(page) }, true),
    [update]
  );

  const setLimit = useCallback(
    (limit: number) => update({ limit: String(limit), page: '1' }, true),
    [update]
  );

  const setSortBy = useCallback(
    (column: string, order: 'asc' | 'desc' | 'none') => {
      update({ sortBy: order === 'none' ? '' : column, order, page: '1' });
    },
    [update]
  );

  const setGroupBy = useCallback(
    (g: GroupBy) => update({ groupBy: g }),
    [update]
  );

  const setViewMode = useCallback(
    (m: ViewMode) => update({ viewMode: m, page: '1' }),
    [update]
  );

  const applySalaryFilter = useCallback(
    (min: number, max: number, currency: string) => {
      setParams((prev) => {
        const next = new URLSearchParams(prev);
        if (currency) next.set('salaryCurrency', currency); else next.delete('salaryCurrency');
        if (min > 0) next.set('salaryMin', String(min)); else next.delete('salaryMin');
        if (max > 0) next.set('salaryMax', String(max)); else next.delete('salaryMax');
        next.delete('page');
        return next;
      }, { replace: true });
    },
    [setParams]
  );

  const clearSalaryFilter = useCallback(() => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('salaryMin');
      next.delete('salaryMax');
      next.delete('salaryCurrency');
      return next;
    }, { replace: true });
  }, [setParams]);

  const clearAllFilters = useCallback(() => {
    setParams(
      (prev) => {
        const next = new URLSearchParams();
        // Preserve non-filter params
        const viewMode = prev.get('viewMode');
        if (viewMode) next.set('viewMode', viewMode);
        return next;
      },
      { replace: true }
    );
  }, [setParams]);

  return {
    filters,
    setSearch,
    toggleStatus,
    setCountry,
    setRole,
    setPage,
    setLimit,
    setSortBy,
    setGroupBy,
    setViewMode,
    applySalaryFilter,
    clearSalaryFilter,
    clearAllFilters,
  };
}
