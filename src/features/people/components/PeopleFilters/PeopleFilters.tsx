import { useState, useCallback } from 'react';
import styled from 'styled-components';
import { Checkbox } from '@/ui-kit/checkbox';
import { Button } from '@/ui-kit/button';
import { FilterChip } from '@/shared/ui/FilterChip/FilterChip';
import { useSavedFilters } from '../../hooks/useSavedFilters';
import { PeopleFiltersState, GroupBy } from '../../types';

const FiltersRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const ChipsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  min-height: 28px;
`;

const SavedRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding-top: 4px;
`;

const Select = styled.select`
  height: 36px;
  padding: 0 10px;
  border: 1px solid var(--colors-gray-400);
  border-radius: 8px;
  background: var(--colors-blank);
  color: var(--colors-gray-700);
  font-size: 1.3rem;
  cursor: pointer;

  &:hover {
    border-color: var(--colors-brand);
  }
`;

const ClearButton = styled.button`
  padding: 4px 10px;
  border: none;
  background: none;
  color: var(--colors-gray-500);
  font-size: 1.2rem;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: var(--colors-gray-700);
  }
`;

const SavedFilterChip = styled.button<{ $active?: boolean }>`
  padding: 4px 10px;
  border: 1px solid ${({ $active }) =>
    $active ? 'var(--colors-brand)' : 'var(--colors-gray-300)'};
  border-radius: 16px;
  background: ${({ $active }) => ($active ? '#f0eeff' : 'var(--colors-blank)')};
  color: ${({ $active }) =>
    $active ? 'var(--colors-brand)' : 'var(--colors-gray-600)'};
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    border-color: var(--colors-brand);
    color: var(--colors-brand);
  }
`;

const SaveInput = styled.input`
  height: 30px;
  padding: 0 8px;
  border: 1px solid var(--colors-gray-400);
  border-radius: 6px;
  font-size: 1.3rem;
  width: 160px;
`;

const Divider = styled.span`
  color: var(--colors-gray-300);
`;

const GroupRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Label = styled.span`
  font-size: 1.3rem;
  color: var(--colors-gray-500);
`;

const GROUP_OPTIONS: { value: GroupBy; label: string }[] = [
  { value: 'none', label: 'No grouping' },
  { value: 'country', label: 'Country' },
  { value: 'status', label: 'Status' },
  { value: 'role', label: 'Role' },
];

type Props = {
  filters: PeopleFiltersState;
  countries: string[];
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
      <FiltersRow>
        <Checkbox
          label="Active"
          checked={filters.status.includes('active')}
          onChange={() => onToggleStatus('active')}
        />
        <Checkbox
          label="Onboarding"
          checked={filters.status.includes('onboarding')}
          onChange={() => onToggleStatus('onboarding')}
        />
        <Checkbox
          label="Offboarded"
          checked={filters.status.includes('offboarded')}
          onChange={() => onToggleStatus('offboarded')}
        />

        <Divider>|</Divider>

        <Select
          value={filters.country}
          onChange={(e) => onSetCountry(e.target.value)}
          aria-label="Filter by country"
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
        >
          <option value="">All types</option>
          <option value="employee">Employee</option>
          <option value="contractor">Contractor</option>
        </Select>
      </FiltersRow>

      {hasActiveFilters && (
        <ChipsRow>
          {filters.status.map((s) => (
            <FilterChip
              key={s}
              label={s.charAt(0).toUpperCase() + s.slice(1)}
              onRemove={() => onToggleStatus(s)}
            />
          ))}
          {filters.country && (
            <FilterChip
              label={filters.country}
              onRemove={() => onSetCountry('')}
            />
          )}
          {filters.role && (
            <FilterChip
              label={filters.role.charAt(0).toUpperCase() + filters.role.slice(1)}
              onRemove={() => onSetRole('')}
            />
          )}
          {filters.search && (
            <FilterChip
              label={`"${filters.search}"`}
              onRemove={() => onLoadFilter({ ...filters })}
            />
          )}
          <ClearButton type="button" onClick={onClearAll}>
            Clear all
          </ClearButton>
        </ChipsRow>
      )}

      <GroupRow>
        <Label>Group by:</Label>
        <Select
          value={filters.groupBy}
          onChange={(e) => onSetGroupBy(e.target.value as GroupBy)}
          aria-label="Group by"
        >
          {GROUP_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      </GroupRow>

      <SavedRow>
        <Label>Saved:</Label>
        {savedFilters.map((sf) => (
          <SavedFilterChip
            key={sf.id}
            type="button"
            onClick={() => onLoadFilter(sf.filters)}
            title={`Load filter: ${sf.name}`}
          >
            {sf.name}
            <span
              onClick={(e) => {
                e.stopPropagation();
                deleteFilter(sf.id);
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
            />
            <Button
              onClick={handleSave}
              style={{ minHeight: 30, padding: '4px 12px', fontSize: '1.2rem' }}
            >
              Save
            </Button>
            <ClearButton type="button" onClick={() => setShowSaveInput(false)}>
              Cancel
            </ClearButton>
          </>
        ) : (
          <SavedFilterChip
            type="button"
            onClick={() => setShowSaveInput(true)}
            title="Save current filters"
          >
            + Save current
          </SavedFilterChip>
        )}
      </SavedRow>
    </>
  );
};
