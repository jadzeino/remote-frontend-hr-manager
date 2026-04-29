import { TableThCell } from '@/ui-kit/table';
import styled from 'styled-components';

const SortButton = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: inherit;
  font-weight: 600;
  color: ${({ $active }) => ($active ? 'var(--colors-gray-900, #0F1A24)' : 'var(--Grey-600, #4B5865)')};
  padding: 0;
  font-family: inherit;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  transition: color 0.15s ease;

  &:hover {
    color: var(--colors-gray-900, #0F1A24);
  }

  &:focus-visible {
    outline: 2px solid var(--colors-brand);
    outline-offset: 2px;
    border-radius: 2px;
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

const SortIconWrapper = styled.span<{ $active: boolean }>`
  display: inline-flex;
  color: ${({ $active }) => ($active ? 'var(--colors-brand, #4F6AF5)' : 'var(--colors-gray-400, #94A3B8)')};
  transition: color 0.15s ease;

  ${SortButton}:hover & {
    color: ${({ $active }) => ($active ? 'var(--colors-brand, #4F6AF5)' : 'var(--Grey-600, #4B5865)')};
  }
`;

type Order = 'asc' | 'desc' | 'none';

function SortIcon({ order }: { order: Order }) {
  if (order === 'asc') {
    return (
      <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden="true">
        <path d="M5 1L9 5H1L5 1Z" fill="currentColor" />
        <path d="M5 11L1 7H9L5 11Z" fill="currentColor" fillOpacity="0.3" />
      </svg>
    );
  }
  if (order === 'desc') {
    return (
      <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden="true">
        <path d="M5 1L9 5H1L5 1Z" fill="currentColor" fillOpacity="0.3" />
        <path d="M5 11L1 7H9L5 11Z" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden="true">
      <path d="M5 1L9 5H1L5 1Z" fill="currentColor" />
      <path d="M5 11L1 7H9L5 11Z" fill="currentColor" />
    </svg>
  );
}

type Props = {
  column: string;
  label: string;
  currentSort: string;
  currentOrder: Order;
  onSort: (column: string, order: Order) => void;
  $textAlign?: 'left' | 'right' | 'center';
  disabled?: boolean;
};

function nextOrder(current: Order): Order {
  if (current === 'none') return 'asc';
  if (current === 'asc') return 'desc';
  return 'none';
}

export const SortableHeader = ({
  column,
  label,
  currentSort,
  currentOrder,
  onSort,
  $textAlign,
  disabled,
}: Props) => {
  const isActive = currentSort === column;
  const activeOrder: Order = isActive ? currentOrder : 'none';

  const handleClick = () => {
    onSort(column, nextOrder(activeOrder));
  };

  return (
    <TableThCell $textAlign={$textAlign}>
      <SortButton
        type="button"
        onClick={handleClick}
        disabled={disabled}
        $active={isActive && activeOrder !== 'none'}
        aria-label={`Sort by ${label}`}
        aria-sort={
          isActive && activeOrder !== 'none'
            ? activeOrder === 'asc'
              ? 'ascending'
              : 'descending'
            : 'none'
        }
      >
        {label}
        <SortIconWrapper $active={isActive && activeOrder !== 'none'}>
          <SortIcon order={activeOrder} />
        </SortIconWrapper>
      </SortButton>
    </TableThCell>
  );
};
