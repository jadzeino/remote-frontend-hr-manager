import { useState, useEffect } from 'react';
import { Table, TableCell, TableRow, TableThCell } from '@/ui-kit/table';
import { Text } from '@/ui-kit/text';
import { Button } from '@/ui-kit/button';
import styled from 'styled-components';
import { usePeopleQuery } from '../../hooks/usePeopleQuery';
import { useGroupedPeople } from '../../hooks/useGroupedPeople';
import { PeopleSkeletonRows } from '../PeopleSkeleton/PeopleSkeleton';
import { PeopleTableRow } from './PeopleTableRow';
import { SortableHeader } from './SortableHeader';
import { Person, PeopleFiltersState } from '../../types';

export const TABLE_SCROLL_ID = 'people-table-scroll';

const ScrollArea = styled.div`
  overflow-y: auto;
  flex: 1;
  min-height: 0;
`;

const TableWrapper = styled.div<{ $isFetching?: boolean }>`
  transition: opacity 0.15s ease;
  ${({ $isFetching }) => $isFetching && 'opacity: 0.55;'}
`;

const EmptyState = styled.div`
  padding: 48px;
  text-align: center;
`;

const ErrorState = styled.div`
  padding: 48px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const GroupHeader = styled.tr`
  cursor: pointer;

  &:hover td {
    background-color: var(--colors-gray-100);
  }

  td {
    background-color: var(--colors-gray-50);
    padding: 8px 16px;
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--colors-gray-500);
    letter-spacing: 0.05em;
    text-transform: uppercase;
    border-top: 2px solid var(--colors-gray-200);
    user-select: none;
  }
`;

const GroupHeaderContent = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const Chevron = styled.span<{ $collapsed: boolean }>`
  display: inline-block;
  transition: transform 0.2s ease;
  transform: rotate(${({ $collapsed }) => ($collapsed ? '-90deg' : '0deg')});
  line-height: 1;
`;

type Props = {
  filters: PeopleFiltersState;
  onRowClick: (person: Person) => void;
  onSort: (column: string, order: 'asc' | 'desc' | 'none') => void;
  /** Forwarded to the parent so the footer can read total/page info */
  onDataReady?: (total: number, totalPages: number) => void;
};

export const PeopleTable = ({ filters, onRowClick, onSort, onDataReady }: Props) => {
  const { data, isLoading, isError, refetch, isFetching } = usePeopleQuery(filters);

  const people = data?.data ?? [];
  const groups = useGroupedPeople(people, filters.groupBy);

  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  useEffect(() => {
    setCollapsed(new Set());
  }, [filters.groupBy]);

  useEffect(() => {
    if (data) onDataReady?.(data.total, data.totalPages);
  }, [data, onDataReady]);

  const toggleGroup = (key: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const showSkeleton = isLoading || (isFetching && !data);
  const isGrouped = filters.groupBy !== 'none';

  if (isError) {
    return (
      <ErrorState role="alert">
        <Text $variant="bodyM" $color="gray-700">Failed to load people. Please try again.</Text>
        <Button onClick={() => refetch()}>Retry</Button>
      </ErrorState>
    );
  }

  const isEmpty = !isLoading && people.length === 0;

  return (
    <ScrollArea id={TABLE_SCROLL_ID}>
      <TableWrapper $isFetching={isFetching && !isLoading}>
        <Table role="grid" aria-label="People list" aria-busy={isFetching}>
          <thead>
            <tr>
              <SortableHeader column="name" label="Name" currentSort={filters.sortBy} currentOrder={filters.order} onSort={onSort} />
              <SortableHeader column="jobTitle" label="Role" currentSort={filters.sortBy} currentOrder={filters.order} onSort={onSort} />
              <TableThCell>Type</TableThCell>
              <TableThCell>Status</TableThCell>
              <SortableHeader column="country" label="Country" currentSort={filters.sortBy} currentOrder={filters.order} onSort={onSort} />
              <SortableHeader column="salary" label="Salary" currentSort={filters.sortBy} currentOrder={filters.order} onSort={onSort} $textAlign="right" />
            </tr>
          </thead>

          {showSkeleton && (
            <tbody><PeopleSkeletonRows /></tbody>
          )}

          {!showSkeleton && isEmpty && (
            <tbody>
              <TableRow>
                <TableCell colSpan={6}>
                  <EmptyState>
                    <Text $variant="bodyM" $color="gray-500">
                      No people found. Try adjusting your search or filters.
                    </Text>
                  </EmptyState>
                </TableCell>
              </TableRow>
            </tbody>
          )}

          {!showSkeleton && !isEmpty && groups.map((group) => {
            const isCollapsed = collapsed.has(group.key);
            return (
              <tbody key={group.key}>
                {isGrouped && (
                  <GroupHeader onClick={() => toggleGroup(group.key)} aria-expanded={!isCollapsed}>
                    <td colSpan={6}>
                      <GroupHeaderContent>
                        <Chevron $collapsed={isCollapsed}>▼</Chevron>
                        {group.label} ({group.people.length})
                      </GroupHeaderContent>
                    </td>
                  </GroupHeader>
                )}
                {!isCollapsed && group.people.map((person) => (
                  <PeopleTableRow key={person.id} person={person} onClick={onRowClick} />
                ))}
              </tbody>
            );
          })}
        </Table>
      </TableWrapper>
    </ScrollArea>
  );
};
