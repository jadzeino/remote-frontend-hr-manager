import { TableThCell } from '@/ui-kit/table';
import styled from 'styled-components';

const SortButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: inherit;
  font-weight: 600;
  color: var(--colors-darkBlue);
  padding: 0;
  font-family: inherit;

  &:focus-visible {
    outline: 2px solid var(--colors-brand);
    outline-offset: 2px;
    border-radius: 2px;
  }
`;

const SortIndicator = styled.span`
  font-size: 1rem;
  color: var(--colors-gray-400);
  line-height: 1;
`;

type Order = 'asc' | 'desc' | 'none';

type Props = {
  column: string;
  label: string;
  currentSort: string;
  currentOrder: Order;
  onSort: (column: string, order: Order) => void;
  $textAlign?: 'left' | 'right' | 'center';
};

function nextOrder(current: Order): Order {
  if (current === 'none') return 'asc';
  if (current === 'asc') return 'desc';
  return 'none';
}

function indicator(order: Order): string {
  if (order === 'asc') return '↑';
  if (order === 'desc') return '↓';
  return '⇅';
}

export const SortableHeader = ({
  column,
  label,
  currentSort,
  currentOrder,
  onSort,
  $textAlign,
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
        <SortIndicator aria-hidden="true">
          {isActive ? indicator(activeOrder) : '⇅'}
        </SortIndicator>
      </SortButton>
    </TableThCell>
  );
};
