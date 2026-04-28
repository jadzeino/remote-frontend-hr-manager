import { useRef, useCallback } from 'react';
import styled from 'styled-components';
import { Table, TableCell, TableRow, TableThCell } from '@/ui-kit/table';
import { Text } from '@/ui-kit/text';
import { Button } from '@/ui-kit/button';
import { useIntersectionObserver } from '@/shared/hooks/useIntersectionObserver';
import { usePeopleInfinite } from '../../hooks/usePeopleInfinite';
import { useGroupedPeople } from '../../hooks/useGroupedPeople';
import { PeopleSkeletonRows } from '../PeopleSkeleton/PeopleSkeleton';
import { PeopleTableRow } from '../PeopleTable/PeopleTableRow';
import { SortableHeader } from '../PeopleTable/SortableHeader';
import { Person, PeopleFiltersState } from '../../types';

const TableWrapper = styled.div`
  overflow-x: auto;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
`;

const TriggerRow = styled.div`
  height: 1px;
`;

const EndMessage = styled.div`
  padding: 24px;
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
  td {
    background-color: var(--colors-gray-50);
    padding: 8px 16px;
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--colors-gray-500);
    letter-spacing: 0.05em;
    text-transform: uppercase;
    border-top: 2px solid var(--colors-gray-200);
  }
`;

type Props = {
  filters: PeopleFiltersState;
  onRowClick: (person: Person) => void;
  onSort: (column: string, order: 'asc' | 'desc' | 'none') => void;
};

export const InfiniteScrollTable = ({ filters, onRowClick, onSort }: Props) => {
  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePeopleInfinite(filters);

  const triggerRef = useRef<HTMLDivElement>(null);

  const handleIntersect = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useIntersectionObserver(triggerRef, handleIntersect, {
    enabled: !isLoading && !isError,
    rootMargin: '200px',
  });

  const allPeople = data?.pages.flatMap((p) => p.data) ?? [];
  const groups = useGroupedPeople(allPeople, filters.groupBy);
  const total = data?.pages[0]?.total ?? 0;

  if (isError) {
    return (
      <ErrorState role="alert">
        <Text $variant="bodyM" $color="gray-700">
          Failed to load people. Please try again.
        </Text>
        <Button onClick={() => refetch()}>Retry</Button>
      </ErrorState>
    );
  }

  return (
    <>
      <TableWrapper>
        <Table
          role="grid"
          aria-label={`People list, ${total} total`}
          aria-busy={isLoading || isFetchingNextPage}
        >
          <thead>
            <tr>
              <SortableHeader
                column="name"
                label="Name"
                currentSort={filters.sortBy}
                currentOrder={filters.order}
                onSort={onSort}
              />
              <SortableHeader
                column="jobTitle"
                label="Role"
                currentSort={filters.sortBy}
                currentOrder={filters.order}
                onSort={onSort}
              />
              <TableThCell>Type</TableThCell>
              <TableThCell>Status</TableThCell>
              <SortableHeader
                column="country"
                label="Country"
                currentSort={filters.sortBy}
                currentOrder={filters.order}
                onSort={onSort}
              />
              <SortableHeader
                column="salary"
                label="Salary"
                currentSort={filters.sortBy}
                currentOrder={filters.order}
                onSort={onSort}
                $textAlign="right"
              />
            </tr>
          </thead>

          {isLoading ? (
            <tbody>
              <PeopleSkeletonRows />
            </tbody>
          ) : (
            groups.map((group) => (
              <tbody key={group.key}>
                {filters.groupBy !== 'none' && (
                  <GroupHeader>
                    <td colSpan={6}>
                      {group.label} ({group.people.length})
                    </td>
                  </GroupHeader>
                )}
                {group.people.map((person) => (
                  <PeopleTableRow
                    key={person.id}
                    person={person}
                    onClick={onRowClick}
                  />
                ))}
              </tbody>
            ))
          )}

          {isFetchingNextPage && (
            <tbody>
              <PeopleSkeletonRows colCount={6} />
            </tbody>
          )}

          {!hasNextPage && allPeople.length > 0 && (
            <tbody>
              <TableRow>
                <TableCell colSpan={6}>
                  <EndMessage>
                    <Text $variant="bodyXS" $color="gray-500">
                      All {total} members loaded
                    </Text>
                  </EndMessage>
                </TableCell>
              </TableRow>
            </tbody>
          )}
        </Table>
      </TableWrapper>

      <TriggerRow ref={triggerRef} aria-hidden="true" />
    </>
  );
};
