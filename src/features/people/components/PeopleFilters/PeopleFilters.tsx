import { useCallback } from 'react';
import styled from 'styled-components';
import { FilterChip } from '@/shared/ui/FilterChip/FilterChip';
import { Checkbox } from '@/ui-kit/checkbox';
import { useSavedFilters } from '../../hooks/useSavedFilters';
import { PeopleFiltersState, GroupBy } from '../../types';
import { SavedFiltersMenu } from '../SavedFiltersMenu/SavedFiltersMenu';
import { SalaryRangeFilter } from '../SalaryRangeFilter/SalaryRangeFilter';

// Single compact row: [Country] [Type] | Group:[select] | [saved chips] [+Save] [Clear all]
const ControlsBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
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

const Select = styled.select`
  height: 34px;
  padding: 0 8px;
  border: 1px solid var(--colors-gray-400);
  border-radius: 8px;
  background: var(--colors-blank);
  color: var(--colors-gray-700);
  font-size: 1.3rem;
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:hover:not(:disabled) {
    border-color: var(--colors-brand);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
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
  onToggleStatus: (status: string) => void;
  onSetCountry: (country: string) => void;
  onSetRole: (role: string) => void;
  onSetGroupBy: (g: GroupBy) => void;
  onClearAll: () => void;
  onLoadFilter: (f: { search?: string; status?: string[]; country?: string; role?: string; groupBy?: GroupBy }) => void;
  onApplySalaryFilter: (min: number, max: number, currency: string) => void;
  onClearSalary: () => void;
};

export const PeopleFilters = ({
  filters,
  countries,
  isFetching = false,
  onToggleStatus,
  onSetCountry,
  onSetRole,
  onSetGroupBy,
  onClearAll,
  onLoadFilter,
  onApplySalaryFilter,
  onClearSalary,
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
      {/* Single compact controls row */}
      <ControlsBar>
        <Select
          value={filters.country}
          onChange={(e) => onSetCountry(e.target.value)}
          aria-label="Filter by country"
          disabled={isFetching}
        >
          <option value="">All countries</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>

        <Select
          value={filters.role}
          onChange={(e) => onSetRole(e.target.value)}
          aria-label="Filter by employment type"
          disabled={isFetching}
        >
          <option value="">All types</option>
          <option value="employee">Employee</option>
          <option value="contractor">Contractor</option>
        </Select>

        <ControlsDivider />

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

        <SalaryRangeFilter
          salaryMin={filters.salaryMin}
          salaryMax={filters.salaryMax}
          salaryCurrency={filters.salaryCurrency}
          disabled={isFetching}
          onApplySalaryFilter={onApplySalaryFilter}
          onClearSalary={onClearSalary}
        />

        <ControlsDivider />

        <InlineLabel>Group:</InlineLabel>
        <Select
          value={filters.groupBy}
          onChange={(e) => onSetGroupBy(e.target.value as GroupBy)}
          aria-label="Group by"
          disabled={isFetching}
        >
          {GROUP_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>

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

        {hasActiveFilters && (
          <ClearButton type="button" onClick={onClearAll} disabled={isFetching}>
            Clear all
          </ClearButton>
        )}
      </ControlsBar>

      {/* Active filter chips — only when filters are applied */}
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
