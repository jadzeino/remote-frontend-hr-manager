import { ComponentPropsWithoutRef, ReactElement } from 'react';
import styled from 'styled-components';
import SearchIcon from '@/theme/icons/search.svg?react';

const Container = styled.div`
  position: relative;
`;

const StyledInput = styled.input`
  width: 100%;
  height: 36px;
  padding: 12px 16px 12px 40px;
  border: 1px solid var(--colors-gray-400);
  border-radius: 16px;
  background-color: var(--colors-blank);
  color: var(--colors-gray-700);
  font-size: ${({ theme }) => theme.typography.size.sm};

  &:hover {
    border-color: var(--colors-gray);
  }
`;

const SearchIconWrapper = styled.span`
  position: absolute;
  left: 12px;
  top: 12px;
  width: 16px;
  height: 16px;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

type Props = Omit<ComponentPropsWithoutRef<'input'>, 'type'>;

export const SearchInput = (props: Props): ReactElement => {
  return (
    <Container>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInput {...props} />
    </Container>
  );
};
