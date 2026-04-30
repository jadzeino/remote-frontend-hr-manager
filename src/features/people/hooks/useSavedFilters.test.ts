import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSavedFilters } from './useSavedFilters';

const BASE_FILTERS = {
  search: '', status: [], country: '', role: '', page: 1, limit: 20,
  sortBy: '', order: 'none' as const, groupBy: 'none' as const,
  viewMode: 'pagination' as const, salaryMin: 0, salaryMax: 0, salaryCurrency: '',
};

const STORAGE_KEY = 'people-saved-filters';

function makeLocalStorageMock(initial: Record<string, string> = {}) {
  const store: Record<string, string> = { ...initial };
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
  };
}

beforeEach(() => {
  vi.stubGlobal('localStorage', makeLocalStorageMock());
});

describe('useSavedFilters', () => {
  it('starts with an empty list', () => {
    const { result } = renderHook(() => useSavedFilters());
    expect(result.current.savedFilters).toEqual([]);
  });

  it('saves a filter and retrieves it', () => {
    const { result } = renderHook(() => useSavedFilters());
    act(() => {
      result.current.saveCurrentFilters('My Filter', { ...BASE_FILTERS, search: 'alice' });
    });
    expect(result.current.savedFilters).toHaveLength(1);
    expect(result.current.savedFilters[0].name).toBe('My Filter');
    expect(result.current.savedFilters[0].filters.search).toBe('alice');
  });

  it('stores salary fields correctly', () => {
    const { result } = renderHook(() => useSavedFilters());
    act(() => {
      result.current.saveCurrentFilters('Salary Filter', {
        ...BASE_FILTERS,
        salaryMin: 50000,
        salaryMax: 200000,
        salaryCurrency: 'EUR',
      });
    });
    const f = result.current.savedFilters[0].filters;
    expect(f.salaryMin).toBe(50000);
    expect(f.salaryMax).toBe(200000);
    expect(f.salaryCurrency).toBe('EUR');
  });

  it('blocks saving beyond MAX_FILTERS (5)', () => {
    const { result } = renderHook(() => useSavedFilters());
    act(() => {
      for (let i = 0; i < 6; i++) {
        result.current.saveCurrentFilters(`Filter ${i}`, { ...BASE_FILTERS, search: `term${i}` });
      }
    });
    expect(result.current.savedFilters).toHaveLength(5);
  });

  it('deletes a filter by id', () => {
    const { result } = renderHook(() => useSavedFilters());
    act(() => {
      result.current.saveCurrentFilters('Keep', { ...BASE_FILTERS, search: 'keep' });
    });
    act(() => {
      result.current.saveCurrentFilters('Delete me', { ...BASE_FILTERS, search: 'gone' });
    });
    const idToDelete = result.current.savedFilters.find((f) => f.name === 'Delete me')!.id;
    act(() => {
      result.current.deleteFilter(idToDelete);
    });
    expect(result.current.savedFilters).toHaveLength(1);
    expect(result.current.savedFilters[0].name).toBe('Keep');
  });

  it('omits undefined-equivalent fields from stored filters', () => {
    const { result } = renderHook(() => useSavedFilters());
    act(() => {
      result.current.saveCurrentFilters('Minimal', BASE_FILTERS);
    });
    const f = result.current.savedFilters[0].filters;
    expect(f.search).toBeUndefined();
    expect(f.status).toBeUndefined();
    expect(f.salaryMin).toBeUndefined();
  });

  it('falls back to [] when localStorage contains corrupted JSON', () => {
    vi.stubGlobal('localStorage', makeLocalStorageMock({ [STORAGE_KEY]: 'NOT_VALID_JSON{{{' }));
    const { result } = renderHook(() => useSavedFilters());
    expect(result.current.savedFilters).toEqual([]);
  });

  it('falls back to [] when localStorage contains data with wrong shape', () => {
    vi.stubGlobal('localStorage', makeLocalStorageMock({
      [STORAGE_KEY]: JSON.stringify([{ bad: true }]),
    }));
    const { result } = renderHook(() => useSavedFilters());
    expect(result.current.savedFilters).toEqual([]);
  });

  it('still allows saving after corrupted localStorage is encountered', () => {
    vi.stubGlobal('localStorage', makeLocalStorageMock({ [STORAGE_KEY]: 'CORRUPT' }));
    const { result } = renderHook(() => useSavedFilters());
    act(() => {
      result.current.saveCurrentFilters('New', { ...BASE_FILTERS, country: 'US' });
    });
    expect(result.current.savedFilters).toHaveLength(1);
  });
});
