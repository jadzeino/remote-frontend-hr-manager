import { useEffect, useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
import { SavedFilter } from '../../types';

const MAX_FILTERS = 5;
const MAX_NAME_LENGTH = 30;

const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
`;

const TriggerBtn = styled.button<{ $hasItems: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 12px;
  border: 1px solid ${({ $hasItems }) => ($hasItems ? 'var(--colors-brand)' : 'var(--colors-gray-400)')};
  border-radius: 8px;
  background: ${({ $hasItems }) => ($hasItems ? '#f0eeff' : 'var(--colors-blank)')};
  color: ${({ $hasItems }) => ($hasItems ? 'var(--colors-brand)' : 'var(--colors-gray-600)')};
  font-size: 1.3rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    border-color: var(--colors-brand);
    color: var(--colors-brand);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background: var(--colors-brand);
  color: var(--colors-blank);
  font-size: 1rem;
  font-weight: 700;
`;

const Panel = styled.div<{ $open: boolean }>`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: 280px;
  background: var(--colors-blank);
  border: 1px solid var(--colors-gray-200);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  z-index: 200;
  pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transform: ${({ $open }) => ($open ? 'translateY(0)' : 'translateY(-6px)')};
  transition: opacity 0.15s ease, transform 0.15s ease;
  overflow: hidden;
`;

const PanelHeader = styled.div`
  padding: 12px 14px 8px;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--colors-darkBlue);
  border-bottom: 1px solid var(--colors-gray-100);
`;

const FilterList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 6px 0;
  max-height: 220px;
  overflow-y: auto;
`;

const FilterItem = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  cursor: pointer;
  transition: background 0.1s ease;

  &:hover {
    background: var(--colors-gray-100);
  }
`;

const FilterName = styled.span`
  flex: 1;
  font-size: 1.3rem;
  color: var(--colors-gray-700);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;


const DeleteBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--colors-gray-400);
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover {
    background: #fee2e2;
    color: #dc2626;
  }
`;

const EmptyState = styled.p`
  padding: 16px 14px;
  font-size: 1.3rem;
  color: var(--colors-gray-400);
  text-align: center;
`;

const Divider = styled.div`
  height: 1px;
  background: var(--colors-gray-100);
  margin: 0;
`;

const SaveSection = styled.div`
  padding: 10px 14px;
`;

const LimitMessage = styled.p`
  padding: 10px 14px;
  font-size: 1.2rem;
  color: var(--colors-gray-500);
  text-align: center;
  line-height: 1.5;

  strong {
    color: var(--colors-gray-700);
  }
`;

const InputRow = styled.div`
  display: flex;
  gap: 6px;
`;

const NameInput = styled.input<{ $error?: boolean }>`
  flex: 1;
  height: 32px;
  padding: 0 8px;
  border: 1px solid ${({ $error }) => ($error ? '#dc2626' : 'var(--colors-gray-300)')};
  border-radius: 6px;
  font-size: 1.3rem;
  color: var(--colors-gray-700);
  background: var(--colors-blank);
  transition: border-color 0.15s ease;

  &:focus-visible {
    outline: none;
    border-color: ${({ $error }) => ($error ? '#dc2626' : 'var(--colors-brand)')};
    box-shadow: 0 0 0 3px ${({ $error }) => ($error ? 'rgba(220,38,38,0.15)' : 'rgba(98,77,227,0.15)')};
  }

  &::placeholder {
    color: var(--colors-gray-400);
  }
`;

const InputError = styled.p`
  margin: 4px 0 0;
  font-size: 1.1rem;
  color: #dc2626;
`;

const SaveBtn = styled.button`
  height: 32px;
  padding: 0 12px;
  border: none;
  border-radius: 6px;
  background: var(--colors-brand);
  color: var(--colors-blank);
  font-size: 1.2rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s ease;

  &:hover:not(:disabled) {
    background: #4f3bc0;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CharCount = styled.p<{ $warn: boolean }>`
  margin: 4px 0 0;
  font-size: 1.1rem;
  color: ${({ $warn }) => ($warn ? '#dc2626' : 'var(--colors-gray-400)')};
  text-align: right;
`;

type CurrentFilters = SavedFilter['filters'];

function filtersMatch(a: CurrentFilters, b: CurrentFilters): boolean {
  if ((a.search ?? '') !== (b.search ?? '')) return false;
  if ((a.country ?? '') !== (b.country ?? '')) return false;
  if ((a.role ?? '') !== (b.role ?? '')) return false;
  if ((a.groupBy ?? 'none') !== (b.groupBy ?? 'none')) return false;
  if ((a.salaryMin ?? 0) !== (b.salaryMin ?? 0)) return false;
  if ((a.salaryMax ?? 0) !== (b.salaryMax ?? 0)) return false;
  if ((a.salaryCurrency ?? '') !== (b.salaryCurrency ?? '')) return false;
  const aStatus = [...(a.status ?? [])].sort().join(',');
  const bStatus = [...(b.status ?? [])].sort().join(',');
  return aStatus === bStatus;
}


type Props = {
  savedFilters: SavedFilter[];
  currentFilters: CurrentFilters;
  disabled?: boolean;
  onApply: (f: SavedFilter['filters']) => void;
  onDelete: (id: string) => void;
  onSave: (name: string) => void;
};

export const SavedFiltersMenu = ({ savedFilters, currentFilters, disabled, onApply, onDelete, onSave }: Props) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const atLimit = savedFilters.length >= MAX_FILTERS;
  const activeFilter = savedFilters.find((sf) => filtersMatch(sf.filters, currentFilters)) ?? null;
  const isDuplicate = activeFilter !== null;
  const isDuplicateName = name.trim().length > 0 &&
    savedFilters.some((sf) => sf.name.toLowerCase() === name.trim().toLowerCase());

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useEffect(() => {
    if (open && !atLimit) inputRef.current?.focus();
  }, [open, atLimit]);

  const handleSave = useCallback(() => {
    const trimmed = name.trim();
    if (!trimmed || atLimit || isDuplicate || isDuplicateName) return;
    onSave(trimmed);
    setName('');
  }, [name, atLimit, isDuplicate, isDuplicateName, onSave]);

  return (
    <Wrapper ref={wrapperRef}>
      <TriggerBtn
        type="button"
        $hasItems={savedFilters.length > 0}
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((o) => !o)}
      >
        {activeFilter ? activeFilter.name : savedFilters.length === 0 ? 'No saved filters' : 'Saved filters'}
        {savedFilters.length > 0 && <Badge>{savedFilters.length}</Badge>}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transition: 'transform 0.15s', transform: open ? 'rotate(180deg)' : undefined }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </TriggerBtn>

      <Panel $open={open} role="dialog" aria-label="Saved filters">
        <PanelHeader>Saved filters</PanelHeader>

        {savedFilters.length === 0 ? (
          <EmptyState>No saved filters yet.</EmptyState>
        ) : (
          <FilterList>
            {savedFilters.map((sf) => (
              <FilterItem key={sf.id} onClick={() => { onApply(sf.filters); setOpen(false); }}>
                <FilterName title={sf.name}>{sf.name}</FilterName>
                <DeleteBtn
                  type="button"
                  title="Delete saved filter"
                  aria-label={`Delete ${sf.name}`}
                  onClick={(e) => { e.stopPropagation(); onDelete(sf.id); }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4h6v2" />
                  </svg>
                </DeleteBtn>
              </FilterItem>
            ))}
          </FilterList>
        )}

        <Divider />

        {atLimit ? (
          <LimitMessage>
            <strong>Maximum {MAX_FILTERS} saved filters reached.</strong>
            <br />
            Delete one to save a new filter.
          </LimitMessage>
        ) : isDuplicate ? (
          <LimitMessage>
            Already saved as <strong>{activeFilter!.name}</strong>.
          </LimitMessage>
        ) : (
          <SaveSection>
            <InputRow>
              <NameInput
                ref={inputRef}
                $error={isDuplicateName}
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, MAX_NAME_LENGTH))}
                placeholder="Name this filter…"
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                aria-label="Filter name"
                aria-describedby={isDuplicateName ? 'name-error' : undefined}
                maxLength={MAX_NAME_LENGTH}
              />
              <SaveBtn type="button" onClick={handleSave} disabled={!name.trim() || isDuplicateName}>
                Save
              </SaveBtn>
            </InputRow>
            {isDuplicateName && (
              <InputError id="name-error">Name already exists.</InputError>
            )}
            {!isDuplicateName && name.length > 0 && (
              <CharCount $warn={name.length >= MAX_NAME_LENGTH}>
                {name.length} / {MAX_NAME_LENGTH}
              </CharCount>
            )}
          </SaveSection>
        )}
      </Panel>
    </Wrapper>
  );
};
