import { useCallback, useMemo } from 'react';
import { z } from 'zod';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { SavedFilter, PeopleFiltersState } from '../types';

const STORAGE_KEY = 'people-saved-filters';
const MAX_SAVED_FILTERS = 5;

const savedFilterSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string().max(30),
    savedAt: z.string(),
    filters: z.object({
      search: z.string().optional(),
      status: z.array(z.string()).optional(),
      country: z.string().optional(),
      role: z.string().optional(),
      groupBy: z.enum(['none', 'country', 'status', 'role', 'jobTitle']).optional(),
      salaryMin: z.number().optional(),
      salaryMax: z.number().optional(),
      salaryCurrency: z.string().optional(),
    }),
  })
);

export function useSavedFilters() {
  const [storedFilters, setSavedFilters] = useLocalStorage<unknown>(STORAGE_KEY, []);

  const savedFilters: SavedFilter[] = useMemo(() => {
    const result = savedFilterSchema.safeParse(storedFilters);
    return result.success ? (result.data as SavedFilter[]) : [];
  }, [storedFilters]);

  const saveCurrentFilters = useCallback(
    (name: string, filters: PeopleFiltersState) => {
      setSavedFilters((prev: unknown) => {
        const current: SavedFilter[] = savedFilterSchema.safeParse(prev).success
          ? (savedFilterSchema.parse(prev) as SavedFilter[])
          : [];
        if (current.length >= MAX_SAVED_FILTERS) return current;
        const newFilter: SavedFilter = {
          id: crypto.randomUUID(),
          name,
          filters: {
            search: filters.search || undefined,
            status: filters.status.length > 0 ? filters.status : undefined,
            country: filters.country || undefined,
            role: filters.role || undefined,
            groupBy: filters.groupBy !== 'none' ? filters.groupBy : undefined,
            salaryMin: filters.salaryMin > 0 ? filters.salaryMin : undefined,
            salaryMax: filters.salaryMax > 0 ? filters.salaryMax : undefined,
            salaryCurrency: filters.salaryCurrency || undefined,
          },
          savedAt: new Date().toISOString(),
        };
        return [newFilter, ...current];
      });
    },
    [setSavedFilters]
  );

  const deleteFilter = useCallback(
    (id: string) => {
      setSavedFilters((prev: unknown) => {
        const current: SavedFilter[] = savedFilterSchema.safeParse(prev).success
          ? (savedFilterSchema.parse(prev) as SavedFilter[])
          : [];
        return current.filter((f) => f.id !== id);
      });
    },
    [setSavedFilters]
  );

  return { savedFilters, saveCurrentFilters, deleteFilter };
}
