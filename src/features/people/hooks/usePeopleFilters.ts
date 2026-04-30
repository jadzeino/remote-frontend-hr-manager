import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { sanitizeInput } from '../utils/sanitize';
import { GroupBy, LoadFilterPayload, PeopleFiltersState, ViewMode } from '../types';
import { DEFAULT_LIMIT } from '../constants';

const VALID_CURRENCIES = ['USD', 'EUR', 'GBP'] as const;
const VALID_GROUP_BY: GroupBy[] = ['none', 'country', 'status', 'role', 'jobTitle'];
const VALID_VIEW_MODES: ViewMode[] = ['pagination', 'infinite'];

const safePage  = (n: number) => Number.isFinite(n) && n >= 1 ? n : 1;
const safeLimit = (n: number) => Number.isFinite(n) && n >= 1 ? Math.min(n, 100) : DEFAULT_LIMIT;
const safeNum   = (n: number) => Number.isFinite(n) && n >= 0 ? n : 0;

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
  setStatus: (statuses: string[]) => void;
  loadFilter: (f: LoadFilterPayload) => void;
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

  const rawGroupBy = params.get('groupBy') ?? 'none';
  const rawViewMode = params.get('viewMode') ?? 'pagination';
  const rawCurrency = params.get('salaryCurrency') ?? '';
  const rawOrder = params.get('order') ?? 'none';

  const filters: PeopleFiltersState = {
    search: params.get('search') ?? '',
    status: parseStatus(params.get('status')),
    country: params.get('country') ?? '',
    role: params.get('role') ?? '',
    page: safePage(parseInt(params.get('page') ?? '1', 10)),
    limit: safeLimit(parseInt(params.get('limit') ?? String(DEFAULT_LIMIT), 10)),
    sortBy: params.get('sortBy') ?? '',
    order: (['asc', 'desc', 'none'] as const).includes(rawOrder as 'asc' | 'desc' | 'none')
      ? (rawOrder as PeopleFiltersState['order'])
      : 'none',
    groupBy: VALID_GROUP_BY.includes(rawGroupBy as GroupBy) ? (rawGroupBy as GroupBy) : 'none',
    viewMode: VALID_VIEW_MODES.includes(rawViewMode as ViewMode) ? (rawViewMode as ViewMode) : 'pagination',
    salaryMin: safeNum(parseInt(params.get('salaryMin') ?? '0', 10)),
    salaryMax: safeNum(parseInt(params.get('salaryMax') ?? '0', 10)),
    salaryCurrency: (VALID_CURRENCIES as readonly string[]).includes(rawCurrency) ? rawCurrency : '',
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
    (v: string) => update({ search: sanitizeInput(v, 200), page: '1' }),
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

  const setStatus = useCallback(
    (statuses: string[]) => update({ status: statuses.join(','), page: '1' }),
    [update]
  );

  const loadFilter = useCallback(
    (f: LoadFilterPayload) => {
      setParams((prev) => {
        const next = new URLSearchParams(prev);
        if (f.search !== undefined) {
          if (f.search) next.set('search', sanitizeInput(f.search, 200)); else next.delete('search');
        }
        if (f.status !== undefined) {
          if (f.status.length) next.set('status', f.status.join(',')); else next.delete('status');
        }
        if (f.country !== undefined) {
          if (f.country) next.set('country', f.country); else next.delete('country');
        }
        if (f.role !== undefined) {
          if (f.role) next.set('role', f.role); else next.delete('role');
        }
        if (f.groupBy !== undefined) {
          if (f.groupBy && f.groupBy !== 'none') next.set('groupBy', f.groupBy); else next.delete('groupBy');
        }
        if (f.salaryMin !== undefined) {
          if (f.salaryMin > 0) next.set('salaryMin', String(f.salaryMin)); else next.delete('salaryMin');
        }
        if (f.salaryMax !== undefined) {
          if (f.salaryMax > 0) next.set('salaryMax', String(f.salaryMax)); else next.delete('salaryMax');
        }
        if (f.salaryCurrency !== undefined) {
          if (f.salaryCurrency) next.set('salaryCurrency', f.salaryCurrency); else next.delete('salaryCurrency');
        }
        next.set('page', '1');
        return next;
      });
    },
    [setParams]
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
    setStatus,
    loadFilter,
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
