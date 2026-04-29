import { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { ErrorBoundary } from 'react-error-boundary';
import { Button } from '@/ui-kit/button';
import { SearchInput } from '@/ui-kit/search-input';
import { Text } from '@/ui-kit/text';
import { usePeopleFilters } from './hooks/usePeopleFilters';
import { useDebounce } from './hooks/useDebounce';
import { usePeopleQuery } from './hooks/usePeopleQuery';
import { PeopleFilters } from './components/PeopleFilters/PeopleFilters';
import { TableCard } from './components/TableCard/TableCard';
import { AnalyticsBar } from './components/AnalyticsBar/AnalyticsBar';
import { AddMemberModal } from './components/AddMemberModal/AddMemberModal';
import { PersonDrawer } from './components/PersonDrawer/PersonDrawer';
import { COUNTRIES } from './constants';
import { Person, GroupBy, ViewMode } from './types';
import { exportAllPeople } from './services/peopleApi';
import { exportPeople, ExportFormat } from './utils/exportData';
import { ExportButton } from './components/ExportButton/ExportButton';

const Container = styled.main`
  max-width: var(--layout-width);
  margin: 0 auto;
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h1`
  ${({ theme }) => theme.typography.h2}
  color: var(--colors-darkBlue);
`;

const Subtitle = styled.p`
  font-size: 1.3rem;
  color: var(--colors-gray-500);
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const SearchWrapper = styled.div`
  flex: 1;
  min-width: 220px;
  max-width: 340px;
`;


const ErrorFallback = ({ resetErrorBoundary }: { resetErrorBoundary: () => void }) => (
  <div style={{ padding: 48, textAlign: 'center' }}>
    <Text $variant="bodyM" $color="gray-700">Something went wrong loading the people list.</Text>
    <Button onClick={resetErrorBoundary} style={{ marginTop: 16 }}>Try again</Button>
  </div>
);

type StatusKey = 'active' | 'onboarding' | 'offboarded';

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
    loadFilter,
    applySalaryFilter,
    clearSalaryFilter,
    clearAllFilters,
  } = usePeopleFilters();

  const [searchInput, setSearchInput] = useState(filters.search);
  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      setSearch(debouncedSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = useCallback(async (format: ExportFormat) => {
    setIsExporting(true);
    try {
      const people = await exportAllPeople({
        search: debouncedSearch,
        status: filters.status,
        country: filters.country,
        role: filters.role,
        sortBy: filters.sortBy || undefined,
        order: filters.order !== 'none' ? filters.order : undefined,
      });
      await exportPeople(people, format);
    } finally {
      setIsExporting(false);
    }
  }, [debouncedSearch, filters.status, filters.country, filters.role, filters.sortBy, filters.order]);

  const queryFilters = { ...filters, search: debouncedSearch };

  // isFetching shared across all controls — same cache key as PeopleTable so no extra request
  const { isFetching } = usePeopleQuery(queryFilters);

  const handleRowClick = useCallback((person: Person) => setSelectedPerson(person), []);

  const handleSort = useCallback(
    (column: string, order: 'asc' | 'desc' | 'none') => setSortBy(column, order),
    [setSortBy]
  );

  const handleLoadFilter = useCallback(
    (f: { search?: string; status?: string[]; country?: string; role?: string; groupBy?: GroupBy }) => {
      // Sync the local search input state
      if (f.search !== undefined) setSearchInput(f.search);
      // Apply all URL params in one atomic navigate call
      loadFilter(f);
    },
    [loadFilter]
  );

  const handleClearAll = useCallback(() => {
    setSearchInput('');
    clearAllFilters();
  }, [clearAllFilters]);

  return (
    <Container>
      <TitleRow>
        <TitleBlock>
          <Title data-testid="page-title">People</Title>
          <Subtitle>Manage your team members, contracts, and onboarding.</Subtitle>
        </TitleBlock>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <ExportButton
            onExport={handleExport}
            isExporting={isExporting}
            disabled={isFetching}
          />
          <Button onClick={() => setIsAddModalOpen(true)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 8C9.93 8 11.5 6.43 11.5 4.5S9.93 1 8 1 4.5 2.57 4.5 4.5 6.07 8 8 8Zm0 1.5c-2.67 0-8 1.34-8 4V15h16v-1.5c0-2.66-5.33-4-8-4Z" fill="currentColor"/>
            </svg>
            Add member
          </Button>
        </div>
      </TitleRow>

      {/* Collapsible analytics cards — clicking Active/Onboarding/Offboarded filters the table */}
      <AnalyticsBar
        activeStatuses={filters.status}
        onToggleStatus={(s: StatusKey) => toggleStatus(s)}
        isFetching={isFetching}
      />

      {/* Search + status pill toggles */}
      <Toolbar>
        <SearchWrapper>
          <SearchInput
            placeholder="Search people..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onClear={() => setSearchInput('')}
            disabled={isFetching}
            aria-label="Search people"
            data-testid="search-input"
          />
        </SearchWrapper>

      </Toolbar>

      {/* Country / type / group-by / saved filters — compact single row */}
      <PeopleFilters
        filters={filters}
        countries={COUNTRIES}
        isFetching={isFetching}
        onToggleStatus={toggleStatus}
        onSetCountry={setCountry}
        onSetRole={setRole}
        onSetGroupBy={(g: GroupBy) => setGroupBy(g)}
        onClearAll={handleClearAll}
        onLoadFilter={handleLoadFilter}
        onApplySalaryFilter={applySalaryFilter}
        onClearSalary={clearSalaryFilter}
      />

      {/* Fixed-height table card with integrated footer */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <TableCard
          filters={queryFilters}
          viewMode={filters.viewMode}
          isFetching={isFetching}
          onRowClick={handleRowClick}
          onSort={handleSort}
          onPageChange={setPage}
          onLimitChange={setLimit}
          onViewModeChange={(m: ViewMode) => setViewMode(m)}
        />
      </ErrorBoundary>

      <PersonDrawer person={selectedPerson} onClose={() => setSelectedPerson(null)} />
      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        countries={COUNTRIES}
      />
    </Container>
  );
};
