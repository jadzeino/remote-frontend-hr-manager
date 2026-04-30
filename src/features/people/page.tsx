import { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { ErrorBoundary } from 'react-error-boundary';
import { Button } from '@/ui-kit/button';
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
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const TitleLeft = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
`;

const Title = styled.h1`
  font-family: 'Remote Sans', Inter, sans-serif;
  font-weight: 500;
  font-size: 24px;
  line-height: 32px;
  letter-spacing: 0;
  margin: 0;
  color: var(--colors-gray-900);
`;

const MemberCount = styled.span`
  font-family: Inter, sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0;
  color: var(--colors-gray-600);
  white-space: nowrap;
`;

const ContentCard = styled.div`
  background: var(--colors-blank);
  border: 1px solid var(--colors-gray-200);
  border-radius: 12px;
`;

const FiltersSection = styled.div`
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-bottom: 1px solid var(--colors-gray-200);
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

  // isFetching + total shared across all controls — same cache key as PeopleTable so no extra request
  const { isFetching, data } = usePeopleQuery(queryFilters);
  const total = data?.total ?? 0;

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
        <TitleLeft>
          <Title data-testid="page-title">People</Title>
          {total > 0 && <MemberCount>{total.toLocaleString()} members</MemberCount>}
        </TitleLeft>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
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

      <ContentCard>
        <FiltersSection>
          <PeopleFilters
            filters={filters}
            countries={COUNTRIES}
            isFetching={isFetching}
            searchValue={searchInput}
            onSearchChange={(v) => setSearchInput(v)}
            onSearchClear={() => setSearchInput('')}
            onToggleStatus={toggleStatus}
            onSetCountry={setCountry}
            onSetRole={setRole}
            onSetGroupBy={(g: GroupBy) => setGroupBy(g)}
            onClearAll={handleClearAll}
            onLoadFilter={handleLoadFilter}
            onApplySalaryFilter={applySalaryFilter}
            onClearSalary={clearSalaryFilter}
            onExport={handleExport}
            isExporting={isExporting}
          />
        </FiltersSection>

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
      </ContentCard>

      <PersonDrawer person={selectedPerson} onClose={() => setSelectedPerson(null)} />
      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        countries={COUNTRIES}
      />
    </Container>
  );
};
