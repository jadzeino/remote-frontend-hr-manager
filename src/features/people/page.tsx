import { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { ErrorBoundary } from 'react-error-boundary';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/ui-kit/button';
import { SearchInput } from '@/ui-kit/search-input';
import { Text } from '@/ui-kit/text';
import { usePeopleFilters } from './hooks/usePeopleFilters';
import { useDebounce } from './hooks/useDebounce';
import { PeopleFilters } from './components/PeopleFilters/PeopleFilters';
import { PeopleTable } from './components/PeopleTable/PeopleTable';
import { InfiniteScrollTable } from './components/InfiniteScrollTable/InfiniteScrollTable';
import { ViewToggle } from './components/ViewToggle/ViewToggle';
import { AddMemberModal } from './components/AddMemberModal/AddMemberModal';
import { PersonDrawer } from './components/PersonDrawer/PersonDrawer';
import { fetchCountries } from './services/peopleApi';
import { Person, GroupBy, ViewMode } from './types';

const Container = styled.main`
  max-width: var(--layout-width);
  margin: 0 auto;
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const Title = styled.h1`
  ${({ theme }) => theme.typography.h2}
  color: var(--colors-darkBlue);
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const SearchWrapper = styled.div`
  flex: 1;
  min-width: 200px;
  max-width: 320px;
`;

const ErrorFallback = ({ resetErrorBoundary }: { resetErrorBoundary: () => void }) => (
  <div style={{ padding: 48, textAlign: 'center' }}>
    <Text $variant="bodyM" $color="gray-700">
      Something went wrong loading the people list.
    </Text>
    <Button onClick={resetErrorBoundary} style={{ marginTop: 16 }}>
      Try again
    </Button>
  </div>
);

export const PeoplePage = () => {
  const {
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
    clearAllFilters,
  } = usePeopleFilters();

  // Local search input state — debounced before hitting the URL/query
  const [searchInput, setSearchInput] = useState(filters.search);
  const debouncedSearch = useDebounce(searchInput, 300);

  // Sync debounced value into URL — only fires after 300ms idle
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      setSearch(debouncedSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Countries for filter dropdowns — cached for 10 minutes
  const { data: countries = [] } = useQuery({
    queryKey: ['countries'],
    queryFn: fetchCountries,
    staleTime: 10 * 60_000,
    gcTime: 30 * 60_000,
  });

  const handleRowClick = useCallback((person: Person) => {
    setSelectedPerson(person);
  }, []);

  const handleSort = useCallback(
    (column: string, order: 'asc' | 'desc' | 'none') => {
      setSortBy(column, order);
    },
    [setSortBy]
  );

  const handleLoadFilter = useCallback(
    (f: { search?: string; status?: string[]; country?: string; role?: string }) => {
      if (f.search !== undefined) {
        setSearchInput(f.search);
        setSearch(f.search);
      }
      if (f.status !== undefined) {
        // Apply all statuses at once to avoid sequential URL-state race
        f.status.forEach((s) => {
          if (!filters.status.includes(s)) toggleStatus(s);
        });
        filters.status.forEach((s) => {
          if (!f.status!.includes(s)) toggleStatus(s);
        });
      }
      if (f.country !== undefined) setCountry(f.country ?? '');
      if (f.role !== undefined) setRole(f.role ?? '');
    },
    [filters.status, setSearch, setCountry, setRole, toggleStatus]
  );

  const handleClearAll = useCallback(() => {
    setSearchInput('');
    clearAllFilters();
  }, [clearAllFilters]);

  // Use debounced value for the query (not the URL value which lags by one update)
  const queryFilters = { ...filters, search: debouncedSearch };

  return (
    <Container>
      <TitleRow>
        <Title data-testid="page-title">People</Title>
        <Button onClick={() => setIsAddModalOpen(true)}>
          + Add member
        </Button>
      </TitleRow>

      <Toolbar>
        <SearchWrapper>
          <SearchInput
            placeholder="Search people..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            aria-label="Search people"
            data-testid="search-input"
          />
        </SearchWrapper>
        <ViewToggle
          value={filters.viewMode}
          onChange={(m: ViewMode) => setViewMode(m)}
        />
      </Toolbar>

      <PeopleFilters
        filters={filters}
        countries={countries}
        onToggleStatus={toggleStatus}
        onSetCountry={setCountry}
        onSetRole={setRole}
        onSetGroupBy={(g: GroupBy) => setGroupBy(g)}
        onClearAll={handleClearAll}
        onLoadFilter={handleLoadFilter}
      />

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {filters.viewMode === 'pagination' ? (
          <PeopleTable
            filters={queryFilters}
            onRowClick={handleRowClick}
            onPageChange={setPage}
            onLimitChange={setLimit}
            onSort={handleSort}
          />
        ) : (
          <InfiniteScrollTable
            filters={queryFilters}
            onRowClick={handleRowClick}
            onSort={handleSort}
          />
        )}
      </ErrorBoundary>

      <PersonDrawer
        person={selectedPerson}
        onClose={() => setSelectedPerson(null)}
      />

      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        countries={countries}
      />
    </Container>
  );
};
