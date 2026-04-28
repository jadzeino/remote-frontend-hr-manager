import { Pagination } from '@/ui-kit/pagination';
import { Table, TableCell, TableRow, TableThCell } from '@/ui-kit/table';
import { Text } from '@/ui-kit/text';
import { ReactElement, useEffect, useState } from 'react';
import { Person } from 'types/person';
import { LoadingCell, BodyContainer } from './PeopleTable.styled';

const getPeople = async (search: string, page: number): Promise<Person[]> => {
  // The basics to get you started. Show us what you got ✨
  let queryParams = `?_page=${page}`;

  if (search) {
    queryParams += `&name_like=${search}`;
  }

  const url = `http://localhost:4002/people${queryParams}`;
  const response = await fetch(url, { method: 'GET' });

  const people = await response.json();

  return people;
};

const capitalizeFirst = (text: string | undefined): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

type Props = {
  search: string;
};

export const PeopleTable = (props: Props): ReactElement => {
  const { search } = props;
  const [people, setPeople] = useState<Person[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadPeople = async (): Promise<void> => {
      setIsLoading(true);

      const data = await getPeople(search, currentPage);

      setPeople(data);
      setIsLoading(false);
    };

    loadPeople();
  }, [search, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Table>
        <thead>
          <tr>
            <TableThCell>Name</TableThCell>
            <TableThCell>Role</TableThCell>
            <TableThCell>Type</TableThCell>
            <TableThCell>Status</TableThCell>
            <TableThCell>Country</TableThCell>
            <TableThCell>Salary</TableThCell>
          </tr>
        </thead>
        {isLoading && (
          <BodyContainer>
            <tr>
              <LoadingCell colSpan={6}>
                <Text $variant="bodyM">Loading...</Text>
              </LoadingCell>
            </tr>
          </BodyContainer>
        )}

        {!isLoading && (
          <tbody>
            {people?.map((person) => (
              <TableRow key={person.name}>
                <TableCell>{person.name}</TableCell>
                <TableCell>{person.jobTitle}</TableCell>
                <TableCell>{capitalizeFirst(person.employment)}</TableCell>
                <TableCell>{capitalizeFirst(person.status)}</TableCell>
                <TableCell>{person.country}</TableCell>
                <TableCell>{person.salary}</TableCell>
              </TableRow>
            ))}
          </tbody>
        )}
      </Table>

      {!isLoading && (
        <Pagination
          currentPage={currentPage}
          totalItems={250}
          itemsPerPage={25}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
};
