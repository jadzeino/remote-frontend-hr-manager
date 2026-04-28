import { Table, TableCell, TableRow, TableThCell } from '@/ui-kit/table';
import { Pagination } from '@/ui-kit/pagination';
import { Text } from '@/ui-kit/text';
import { Button } from '@/ui-kit/button';
import styled from 'styled-components';
import { usePeopleQuery } from '../../hooks/usePeopleQuery';
import { useGroupedPeople } from '../../hooks/useGroupedPeople';
import { PeopleSkeletonRows } from '../PeopleSkeleton/PeopleSkeleton';
import { PeopleTableRow } from './PeopleTableRow';
import { SortableHeader } from './SortableHeader';
import { Person, PeopleFiltersState } from '../../types';

const TableWrapper = styled.div`
  overflow-x: auto;
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
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onSort: (column: string, order: 'asc' | 'desc' | 'none') => void;
};

export const PeopleTable = ({
  filters,
  onRowClick,
  onPageChange,
  onLimitChange,
  onSort,
}: Props) => {
  const { data, isLoading, isError, refetch, isFetching } =
    usePeopleQuery(filters);

  const people = data?.data ?? [];
  const groups = useGroupedPeople(people, filters.groupBy);

  const showSkeleton = isLoading || (isFetching && !data);

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

  const isEmpty = !isLoading && people.length === 0;

  return (
    <>
      <TableWrapper>
        <Table role="grid" aria-label="People list" aria-busy={isFetching}>
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

          {showSkeleton && (
            <tbody>
              <PeopleSkeletonRows />
            </tbody>
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

          {!showSkeleton &&
            !isEmpty &&
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
            ))}
        </Table>
      </TableWrapper>

      {data && (
        <Pagination
          currentPage={filters.page}
          totalItems={data.total}
          itemsPerPage={filters.limit}
          onPageChange={onPageChange}
          handleSizeChange={onLimitChange}
        />
      )}
    </>
  );
};
