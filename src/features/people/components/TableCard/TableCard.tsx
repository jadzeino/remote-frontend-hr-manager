import { useState, useCallback } from 'react';
import styled from 'styled-components';
import { PeopleTable } from '../PeopleTable/PeopleTable';
import { InfiniteScrollTable } from '../InfiniteScrollTable/InfiniteScrollTable';
import { Person, PeopleFiltersState, ViewMode } from '../../types';
import ChevronLeft from '@/theme/icons/chevron-left.svg?react';
import ChevronRight from '@/theme/icons/chevron-right.svg?react';
import ChevronsLeft from '@/theme/icons/chevrons-left.svg?react';
import ChevronsRight from '@/theme/icons/chevrons-right.svg?react';

const Card = styled.div`
  display: flex;
  flex-direction: column;
  background: var(--colors-blank);
  border: 1px solid var(--colors-gray-200);
  border-radius: 12px;
  overflow: hidden;
  height: 600px;
`;

const TableArea = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 16px;
  border-top: 1px solid var(--colors-gray-200);
  background: var(--colors-blank);
  flex-shrink: 0;
  flex-wrap: wrap;
`;

const RecordCount = styled.span`
  font-size: 1.2rem;
  color: var(--colors-gray-500);
  white-space: nowrap;
`;

const FooterCenter = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ViewToggleGroup = styled.div`
  display: inline-flex;
  border: 1px solid var(--colors-gray-300);
  border-radius: 6px;
  overflow: hidden;
`;

const ViewToggleBtn = styled.button<{ $active: boolean }>`
  padding: 5px 12px;
  border: none;
  font-size: 1.2rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  background: ${({ $active }) => ($active ? 'var(--colors-brand)' : 'var(--colors-blank)')};
  color: ${({ $active }) => ($active ? 'var(--colors-blank)' : 'var(--colors-gray-600)')};

  &:hover:not(:disabled) {
    background: ${({ $active }) => ($active ? 'var(--colors-brand)' : 'var(--colors-gray-100)')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const NavBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid var(--colors-gray-300);
  border-radius: 5px;
  background: var(--colors-blank);
  color: var(--colors-gray);
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:hover:not(:disabled) { border-color: var(--colors-gray); }
  &:disabled { opacity: 0.4; cursor: not-allowed; }

  svg { width: 14px; height: 14px; }
`;

const PageSelect = styled.select`
  height: 28px;
  padding: 0 20px 0 6px;
  border: 1px solid var(--colors-gray-300);
  border-radius: 5px;
  background: var(--colors-blank);
  color: var(--colors-gray-700);
  font-size: 1.2rem;
  cursor: pointer;
  appearance: none;
  transition: opacity 0.15s ease;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' fill='%23617798'%3E%3Cpath clip-rule='evenodd' d='M14.78 5.47c.3.3.3.77 0 1.06L9.31 12l5.47 5.47a.75.75 0 1 1-1.06 1.06l-6-6a.75.75 0 0 1 0-1.06l6-6c.3-.3.77-.3 1.06 0z' fill-rule='evenodd' transform='rotate(-90 12 12)'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 4px center;
  background-size: 14px;

  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

const RowsSelect = styled(PageSelect)`
  padding: 0 22px 0 6px;
`;

type Props = {
  filters: PeopleFiltersState;
  viewMode: ViewMode;
  isFetching?: boolean;
  onRowClick: (p: Person) => void;
  onSort: (col: string, order: 'asc' | 'desc' | 'none') => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onViewModeChange: (m: ViewMode) => void;
};

export const TableCard = ({
  filters,
  viewMode,
  isFetching = false,
  onRowClick,
  onSort,
  onPageChange,
  onLimitChange,
  onViewModeChange,
}: Props) => {
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const handleDataReady = useCallback((t: number, tp: number) => {
    setTotal(t);
    setTotalPages(tp);
  }, []);

  const startItem = (filters.page - 1) * filters.limit + 1;
  const endItem = Math.min(filters.page * filters.limit, total);

  return (
    <Card>
      <TableArea>
        {viewMode === 'pagination' ? (
          <PeopleTable
            filters={filters}
            onRowClick={onRowClick}
            onSort={onSort}
            onDataReady={handleDataReady}
          />
        ) : (
          <InfiniteScrollTable
            filters={filters}
            onRowClick={onRowClick}
            onSort={onSort}
          />
        )}
      </TableArea>

      <Footer>
        {/* Left: record range */}
        <RecordCount>
          {total > 0
            ? viewMode === 'pagination'
              ? `${startItem}–${endItem} of ${total.toLocaleString()} records`
              : `${total.toLocaleString()} records`
            : '—'}
        </RecordCount>

        {/* Center: view mode toggle + pagination nav */}
        <FooterCenter>
          <ViewToggleGroup role="group" aria-label="View mode">
            <ViewToggleBtn
              type="button"
              $active={viewMode === 'pagination'}
              onClick={() => onViewModeChange('pagination')}
              aria-pressed={viewMode === 'pagination'}
              disabled={isFetching}
            >
              Pagination
            </ViewToggleBtn>
            <ViewToggleBtn
              type="button"
              $active={viewMode === 'infinite'}
              onClick={() => onViewModeChange('infinite')}
              aria-pressed={viewMode === 'infinite'}
              disabled={isFetching}
            >
              Infinite scroll
            </ViewToggleBtn>
          </ViewToggleGroup>

          {viewMode === 'pagination' && total > 0 && (
            <>
              <NavBtn onClick={() => onPageChange(1)} disabled={isFetching || filters.page === 1} aria-label="First page">
                <ChevronsLeft />
              </NavBtn>
              <NavBtn onClick={() => onPageChange(filters.page - 1)} disabled={isFetching || filters.page === 1} aria-label="Previous page">
                <ChevronLeft />
              </NavBtn>
              <PageSelect
                value={filters.page}
                onChange={(e) => onPageChange(Number(e.target.value))}
                aria-label="Page"
                disabled={isFetching}
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </PageSelect>
              <NavBtn onClick={() => onPageChange(filters.page + 1)} disabled={isFetching || filters.page >= totalPages} aria-label="Next page">
                <ChevronRight />
              </NavBtn>
              <NavBtn onClick={() => onPageChange(totalPages)} disabled={isFetching || filters.page >= totalPages} aria-label="Last page">
                <ChevronsRight />
              </NavBtn>
            </>
          )}
        </FooterCenter>

        {/* Right: rows-per-page */}
        {viewMode === 'pagination' && (
          <RowsSelect
            value={filters.limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            aria-label="Rows per page"
            disabled={isFetching}
          >
            <option value={10}>Rows 10</option>
            <option value={25}>Rows 25</option>
            <option value={50}>Rows 50</option>
            <option value={100}>Rows 100</option>
          </RowsSelect>
        )}
      </Footer>
    </Card>
  );
};
