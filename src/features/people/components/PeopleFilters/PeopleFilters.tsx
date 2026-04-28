import { useState, useCallback } from 'react';
import styled from 'styled-components';
import { Button } from '@/ui-kit/button';
import { FilterChip } from '@/shared/ui/FilterChip/FilterChip';
import { useSavedFilters } from '../../hooks/useSavedFilters';
import { PeopleFiltersState, GroupBy } from '../../types';

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

const SavedFilterChip = styled.button<{ $active?: boolean }>`
  padding: 3px 10px;
  border: 1px solid ${({ $active }) =>
    $active ? 'var(--colors-brand)' : 'var(--colors-gray-300)'};
  border-radius: 16px;
  background: ${({ $active }) => ($active ? '#f0eeff' : 'var(--colors-blank)')};
  color: ${({ $active }) =>
    $active ? 'var(--colors-brand)' : 'var(--colors-gray-600)'};
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.15s;

  &:hover:not(:disabled) {
    border-color: var(--colors-brand);
    color: var(--colors-brand);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

const SaveInput = styled.input`
  height: 30px;
  padding: 0 8px;
  border: 1px solid var(--colors-gray-400);
  border-radius: 6px;
  font-size: 1.3rem;
  width: 140px;
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
  onLoadFilter: (f: { search?: string; status?: string[]; country?: string; role?: string }) => void;
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
}: Props) => {
  const { savedFilters, saveCurrentFilters, deleteFilter } = useSavedFilters();
  const [saveName, setSaveName] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);

  const hasActiveFilters =
    filters.status.length > 0 ||
    Boolean(filters.country) ||
    Boolean(filters.role) ||
    Boolean(filters.search);

  const handleSave = useCallback(() => {
    if (!saveName.trim()) return;
    saveCurrentFilters(saveName.trim(), filters);
    setSaveName('');
    setShowSaveInput(false);
  }, [saveName, saveCurrentFilters, filters]);

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

        {(savedFilters.length > 0 || true) && (
          <>
            <ControlsDivider />
            {savedFilters.map((sf) => (
              <SavedFilterChip
                key={sf.id}
                type="button"
                onClick={() => onLoadFilter(sf.filters)}
                title={`Load filter: ${sf.name}`}
                disabled={isFetching}
              >
                {sf.name}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isFetching) deleteFilter(sf.id);
                  }}
                  style={{ marginLeft: 6, opacity: 0.6 }}
                  title="Delete saved filter"
                >
                  ×
                </span>
              </SavedFilterChip>
            ))}

            {showSaveInput ? (
              <>
                <SaveInput
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="Filter name..."
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  autoFocus
                  aria-label="Saved filter name"
                  disabled={isFetching}
                />
                <Button
                  onClick={handleSave}
                  disabled={isFetching}
                  style={{ minHeight: 30, padding: '4px 12px', fontSize: '1.2rem' }}
                >
                  Save
                </Button>
                <ClearButton type="button" onClick={() => setShowSaveInput(false)} disabled={isFetching}>
                  Cancel
                </ClearButton>
              </>
            ) : (
              <SavedFilterChip
                type="button"
                onClick={() => setShowSaveInput(true)}
                title="Save current filters"
                disabled={isFetching}
              >
                + Save
              </SavedFilterChip>
            )}
          </>
        )}

        {hasActiveFilters && (
          <ClearButton type="button" onClick={onClearAll} disabled={isFetching}>
            Clear all
          </ClearButton>
        )}
      </ControlsBar>

      {/* Active filter chips — only when filters are applied */}
      {hasActiveFilters && (
        <ChipsRow>
          {filters.status.map((s) => (
            <FilterChip
              key={s}
              label={s.charAt(0).toUpperCase() + s.slice(1)}
              onRemove={() => onToggleStatus(s)}
              disabled={isFetching}
            />
          ))}
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
