import { ComponentPropsWithoutRef, ReactElement } from 'react';
import styled from 'styled-components';
import SearchIcon from '@/theme/icons/search.svg?react';

const SearchIconWrapper = styled.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--colors-gray-400);
  transition: color 0.15s ease;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  border: none;
  background: var(--colors-gray-200);
  color: var(--colors-gray-800, #222E39);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  padding: 0;
  transition: background 0.15s ease;

  &:hover {
    background: var(--colors-gray-400);
    color: var(--colors-blank);
  }
`;

const StyledInput = styled.input`
  width: 100%;
  height: 34px;
  padding: 6px 8px 6px 40px;
  border: 1px solid var(--colors-gray-500, #697786);
  border-radius: 20px;
  background-color: var(--colors-blank);
  color: var(--colors-gray-700);
  font-size: ${({ theme }) => theme.typography.size.sm};
  transition: border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;

  &::placeholder {
    color: var(--colors-gray-400);
  }

  &:focus-visible {
    outline: none;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: var(--colors-gray-100);
  }
`;

const Container = styled.div`
  position: relative;

  &:hover ${StyledInput} {
    border-color: #7F5AF8;
    background-color: #F5F3FF;
  }

  &:focus-within ${StyledInput} {
    border-color: #7F5AF8;
    background-color: var(--colors-blank);
    /* 2px white gap then 2px Purple-700 outer ring */
    box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #6638EF;
  }

  &:hover ${SearchIconWrapper},
  &:focus-within ${SearchIconWrapper} {
    color: #7F5AF8;
  }
`;

type Props = Omit<ComponentPropsWithoutRef<'input'>, 'type'> & {
  onClear?: () => void;
};

export const SearchInput = ({ onClear, ...props }: Props): ReactElement => {
  const hasValue = Boolean(props.value);

  return (
    <Container>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInput {...props} />
      {hasValue && onClear && (
        <ClearButton
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          tabIndex={-1}
        >
          ×
        </ClearButton>
      )}
    </Container>
  );
};
