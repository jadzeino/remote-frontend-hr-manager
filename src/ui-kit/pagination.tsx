import { ReactElement } from 'react';
import styled from 'styled-components';
import { Text } from './text';
import ChevronLeft from '../theme/icons/chevron-left.svg?react';
import ChevronRight from '../theme/icons/chevron-right.svg?react';
import ChevronsLeft from '../theme/icons/chevrons-left.svg?react';
import ChevronsRight from '../theme/icons/chevrons-right.svg?react';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
`;

const Actions = styled.div`
  display: flex;
  gap: 4px;
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--colors-gray-400);
  border-radius: 6px;
  background: var(--colors-blank);
  color: var(--colors-gray);
  cursor: pointer;

  &:hover {
    border-color: var(--colors-gray);
  }

  &:focus {
    outline: none;
    border-color: var(--colors-gray);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const SizeSelector = styled.select`
  height: 32px;
  padding: 0 22px 0 8px;
  border: 1px solid var(--colors-gray-400);
  border-radius: 6px;
  background: var(--colors-blank);
  color: var(--colors-gray-700);
  text-align: center;
  font-size: ${({ theme }) => theme.typography.size.sm};
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' fill='%23617798'%3E%3Cpath clip-rule='evenodd' d='M14.78 5.47c.3.3.3.77 0 1.06L9.31 12l5.47 5.47a.75.75 0 1 1-1.06 1.06l-6-6a.75.75 0 0 1 0-1.06l6-6c.3-.3.77-.3 1.06 0z' fill-rule='evenodd' transform='rotate(-90 12 12)'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px;

  &:hover {
    border-color: var(--colors-gray);
  }
`;

const PageSelector = styled.select`
  height: 32px;
  padding: 0 26px 0 8px;
  border: 1px solid var(--colors-gray-400);
  border-radius: 6px;
  background: var(--colors-blank);
  color: var(--colors-gray-700);
  text-align: center;
  font-size: ${({ theme }) => theme.typography.size.sm};
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' fill='%23617798'%3E%3Cpath clip-rule='evenodd' d='M14.78 5.47c.3.3.3.77 0 1.06L9.31 12l5.47 5.47a.75.75 0 1 1-1.06 1.06l-6-6a.75.75 0 0 1 0-1.06l6-6c.3-.3.77-.3 1.06 0z' fill-rule='evenodd' transform='rotate(-90 12 12)'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px;

  &:hover {
    border-color: var(--colors-gray);
  }
`;

type Props = {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  handleSizeChange?: (itemsPerPage: number) => void;
};

export const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  handleSizeChange,
}: Props): ReactElement => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePrevious = () => {
    onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    onPageChange(currentPage + 1);
  };

  const handleFirstPage = () => {
    onPageChange(1);
  };

  const handleLastPage = () => {
    onPageChange(totalPages);
  };

  return (
    <Container>
      <Text $variant="bodyXS" $color="gray-500">
        {startItem}-{endItem} of {totalItems} records
      </Text>
      <Actions>
        <NavButton onClick={handleFirstPage}>
          <ChevronsLeft />
        </NavButton>

        <NavButton onClick={handlePrevious}>
          <ChevronLeft />
        </NavButton>

        <PageSelector
          value={currentPage}
          onChange={(e) => onPageChange(Number(e.target.value))}
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <option key={page} value={page}>
              {page}
            </option>
          ))}
        </PageSelector>

        <NavButton onClick={handleNext}>
          <ChevronRight />
        </NavButton>

        <NavButton onClick={handleLastPage}>
          <ChevronsRight />
        </NavButton>

        <SizeSelector
          value={itemsPerPage}
          onChange={(e) => handleSizeChange?.(Number(e.target.value))}
        >
          <option value={10}>Rows 10</option>
          <option value={25}>Rows 25</option>
          <option value={50}>Rows 50</option>
          <option value={100}>Rows 100</option>
        </SizeSelector>
      </Actions>
    </Container>
  );
};
