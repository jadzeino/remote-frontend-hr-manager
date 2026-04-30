import { useCallback } from 'react';
import styled from 'styled-components';
import { FilterChip } from '@/shared/ui/FilterChip/FilterChip';
import { Checkbox } from '@/ui-kit/checkbox';
import { Dropdown } from '@/ui-kit/dropdown';
import { SearchInput } from '@/ui-kit/search-input';
import { useSavedFilters } from '../../hooks/useSavedFilters';
import { PeopleFiltersState, GroupBy } from '../../types';
import { ExportButton } from '../ExportButton/ExportButton';
import { ExportFormat } from '../../utils/exportData';
import { SavedFiltersMenu } from '../SavedFiltersMenu/SavedFiltersMenu';
import { SalaryRangeFilter } from '../SalaryRangeFilter/SalaryRangeFilter';

// Row 1: [Search] [Country] [Type] [Salary]
// Row 2: [Onboarding] [Active] [Offboarded] | Group: [select] | [Saved] [Clear]
const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const SearchWrapper = styled.div`
  flex: 1;
  min-width: 180px;
`;

const Spacer = styled.div`
  flex: 1;
`;

const ControlsDivider = styled.span`
  width: 1px;
  height: 20px;
  background: var(--colors-gray-200);
  align-self: center;
  flex-shrink: 0;
`;

const ChipsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

const InlineLabel = styled.span`
  font-size: 1.3rem;
  color: var(--colors-gray-500);
  white-space: nowrap;
`;

const ClearButton = styled.button`
  padding: 4px 10px;
  border: none;
  background: none;
  color: var(--colors-gray-500);
  font-size: 1.2rem;
  cursor: pointer;
  text-decoration: underline;
  white-space: nowrap;
  transition: opacity 0.15s ease;

  &:hover:not(:disabled) {
    color: var(--colors-gray-700);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

const GROUP_OPTIONS: { value: GroupBy; label: string }[] = [
  { value: 'none',     label: 'No grouping' },
  { value: 'country',  label: 'Country' },
  { value: 'status',   label: 'Status' },
  { value: 'role',     label: 'Employment Type' },
  { value: 'jobTitle', label: 'Job Title' },
];

type Props = {
  filters: PeopleFiltersState;
  countries: string[];
  isFetching?: boolean;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  onToggleStatus: (status: string) => void;
  onSetCountry: (country: string) => void;
  onSetRole: (role: string) => void;
  onSetGroupBy: (g: GroupBy) => void;
  onClearAll: () => void;
  onLoadFilter: (f: { search?: string; status?: string[]; country?: string; role?: string; groupBy?: GroupBy }) => void;
  onApplySalaryFilter: (min: number, max: number, currency: string) => void;
  onClearSalary: () => void;
  onExport: (format: ExportFormat) => void;
  isExporting: boolean;
};

export const PeopleFilters = ({
  filters,
  countries,
  isFetching = false,
  searchValue,
  onSearchChange,
  onSearchClear,
  onToggleStatus,
  onSetCountry,
  onSetRole,
  onSetGroupBy,
  onClearAll,
  onLoadFilter,
  onApplySalaryFilter,
  onClearSalary,
  onExport,
  isExporting,
}: Props) => {
  const { savedFilters, saveCurrentFilters, deleteFilter } = useSavedFilters();

  const hasActiveFilters =
    filters.status.length > 0 ||
    Boolean(filters.country) ||
    Boolean(filters.role) ||
    Boolean(filters.search);

  const handleSave = useCallback(
    (name: string) => saveCurrentFilters(name, filters),
    [saveCurrentFilters, filters]
  );

  return (
    <>
      {/* Row 1: search + data filters */}
      <FilterRow>
        <SearchWrapper>
          <SearchInput
            placeholder="Search people..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={onSearchClear}
            disabled={isFetching}
            aria-label="Search people"
            data-testid="search-input"
          />
        </SearchWrapper>

        <Dropdown
          value={filters.country}
          onChange={(e) => onSetCountry(e.target.value)}
          aria-label="Filter by country"
          disabled={isFetching}
        >
          <option value="">All countries</option>
          {countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Dropdown>

        <Dropdown
          value={filters.role}
          onChange={(e) => onSetRole(e.target.value)}
          aria-label="Filter by employment type"
          disabled={isFetching}
        >
          <option value="">All types</option>
          <option value="employee">Employee</option>
          <option value="contractor">Contractor</option>
        </Dropdown>

        <SalaryRangeFilter
          salaryMin={filters.salaryMin}
          salaryMax={filters.salaryMax}
          salaryCurrency={filters.salaryCurrency}
          disabled={isFetching}
          onApplySalaryFilter={onApplySalaryFilter}
          onClearSalary={onClearSalary}
        />
      </FilterRow>

      {/* Row 2: status + grouping + saved */}
      <FilterRow>
        <Checkbox
          label="Onboarding"
          checked={filters.status.includes('onboarding')}
          onChange={() => onToggleStatus('onboarding')}
          disabled={isFetching}
        />
        <Checkbox
          label="Active"
          checked={filters.status.includes('active')}
          onChange={() => onToggleStatus('active')}
          disabled={isFetching}
        />
        <Checkbox
          label="Offboarded"
          checked={filters.status.includes('offboarded')}
          onChange={() => onToggleStatus('offboarded')}
          disabled={isFetching}
        />

        <ControlsDivider />

        <InlineLabel>Group:</InlineLabel>
        <Dropdown
          value={filters.groupBy}
          onChange={(e) => onSetGroupBy(e.target.value as GroupBy)}
          aria-label="Group by"
          disabled={isFetching}
        >
          {GROUP_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Dropdown>

        <ControlsDivider />

        <SavedFiltersMenu
          savedFilters={savedFilters}
          currentFilters={{
            search: filters.search || undefined,
            status: filters.status.length > 0 ? filters.status : undefined,
            country: filters.country || undefined,
            role: filters.role || undefined,
            groupBy: filters.groupBy !== 'none' ? filters.groupBy : undefined,
            salaryMin: filters.salaryMin > 0 ? filters.salaryMin : undefined,
            salaryMax: filters.salaryMax > 0 ? filters.salaryMax : undefined,
            salaryCurrency: filters.salaryCurrency || undefined,
          }}
          disabled={isFetching}
          onApply={onLoadFilter}
          onDelete={deleteFilter}
          onSave={handleSave}
        />

        <ExportButton
          onExport={onExport}
          isExporting={isExporting}
          disabled={isFetching}
        />

        <Spacer />

        {hasActiveFilters && (
          <ClearButton type="button" onClick={onClearAll} disabled={isFetching}>
            Clear all
          </ClearButton>
        )}
      </FilterRow>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <ChipsRow>
          {filters.country && (
            <FilterChip
              label={filters.country}
              onRemove={() => onSetCountry('')}
              disabled={isFetching}
            />
          )}
          {filters.role && (
            <FilterChip
              label={filters.role.charAt(0).toUpperCase() + filters.role.slice(1)}
              onRemove={() => onSetRole('')}
              disabled={isFetching}
            />
          )}
          {filters.search && (
            <FilterChip
              label={`"${filters.search}"`}
              onRemove={() => onLoadFilter({ ...filters, search: '' })}
              disabled={isFetching}
            />
          )}
        </ChipsRow>
      )}
    </>
  );
};
