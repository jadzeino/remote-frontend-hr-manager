import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { createElement } from 'react';
import { usePeopleFilters } from './usePeopleFilters';
import { DEFAULT_LIMIT } from '../constants';

function renderWithParams(search = '') {
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    createElement(MemoryRouter, { initialEntries: [`/?${search}`] }, children);
  return renderHook(() => usePeopleFilters(), { wrapper });
}

describe('usePeopleFilters — URL param guards', () => {
  it('defaults page to 1 for negative values', () => {
    const { result } = renderWithParams('page=-5');
    expect(result.current.filters.page).toBe(1);
  });

  it('defaults page to 1 for NaN', () => {
    const { result } = renderWithParams('page=NaN');
    expect(result.current.filters.page).toBe(1);
  });

  it('defaults limit to DEFAULT_LIMIT for zero', () => {
    const { result } = renderWithParams('limit=0');
    expect(result.current.filters.limit).toBe(DEFAULT_LIMIT);
  });

  it('caps limit at 100', () => {
    const { result } = renderWithParams('limit=9999');
    expect(result.current.filters.limit).toBe(100);
  });

  it('defaults salaryMin to 0 for negative values', () => {
    const { result } = renderWithParams('salaryMin=-500');
    expect(result.current.filters.salaryMin).toBe(0);
  });

  it('defaults salaryMax to 0 for NaN', () => {
    const { result } = renderWithParams('salaryMax=NaN');
    expect(result.current.filters.salaryMax).toBe(0);
  });

  it('rejects invalid salaryCurrency', () => {
    const { result } = renderWithParams('salaryCurrency=HACKED');
    expect(result.current.filters.salaryCurrency).toBe('');
  });

  it('accepts valid salaryCurrency values', () => {
    const { result } = renderWithParams('salaryCurrency=EUR');
    expect(result.current.filters.salaryCurrency).toBe('EUR');
  });

  it('defaults groupBy to "none" for invalid values', () => {
    const { result } = renderWithParams('groupBy=injected');
    expect(result.current.filters.groupBy).toBe('none');
  });

  it('accepts valid groupBy values', () => {
    const { result } = renderWithParams('groupBy=country');
    expect(result.current.filters.groupBy).toBe('country');
  });

  it('defaults viewMode to "pagination" for invalid values', () => {
    const { result } = renderWithParams('viewMode=hacked');
    expect(result.current.filters.viewMode).toBe('pagination');
  });

  it('defaults order to "none" for invalid values', () => {
    const { result } = renderWithParams('order=INVALID');
    expect(result.current.filters.order).toBe('none');
  });

  it('clearAllFilters removes filter params but keeps viewMode', () => {
    const { result } = renderWithParams('search=alice&country=US&viewMode=infinite');
    act(() => {
      result.current.clearAllFilters();
    });
    expect(result.current.filters.search).toBe('');
    expect(result.current.filters.country).toBe('');
    expect(result.current.filters.viewMode).toBe('infinite');
  });

  it('setSearch sanitizes input', () => {
    const { result } = renderWithParams();
    act(() => {
      result.current.setSearch('<script>evil</script>');
    });
    expect(result.current.filters.search).not.toContain('<');
    expect(result.current.filters.search).not.toContain('>');
  });
});
