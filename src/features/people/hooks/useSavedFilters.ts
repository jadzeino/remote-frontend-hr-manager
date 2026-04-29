import { useCallback } from 'react';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { SavedFilter, PeopleFiltersState } from '../types';

const STORAGE_KEY = 'people-saved-filters';
const MAX_SAVED_FILTERS = 5;

export function useSavedFilters() {
  const [savedFilters, setSavedFilters] = useLocalStorage<SavedFilter[]>(
    STORAGE_KEY,
    []
  );

  const saveCurrentFilters = useCallback(
    (name: string, filters: PeopleFiltersState) => {
      setSavedFilters((prev) => {
        if (prev.length >= MAX_SAVED_FILTERS) return prev;
        const newFilter: SavedFilter = {
          id: Date.now().toString(),
          name,
          filters: {
            search: filters.search || undefined,
            status: filters.status.length > 0 ? filters.status : undefined,
            country: filters.country || undefined,
            role: filters.role || undefined,
          },
          savedAt: new Date().toISOString(),
        };
        return [newFilter, ...prev];
      });
    },
    [setSavedFilters]
  );

  const deleteFilter = useCallback(
    (id: string) => {
      setSavedFilters((prev) => prev.filter((f) => f.id !== id));
    },
    [setSavedFilters]
  );

  return { savedFilters, saveCurrentFilters, deleteFilter };
}
