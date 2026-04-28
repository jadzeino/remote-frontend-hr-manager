import { ComponentPropsWithoutRef, ReactElement } from 'react';
import styled from 'styled-components';
import SearchIcon from '@/theme/icons/search.svg?react';

const Container = styled.div`
  position: relative;
`;

const StyledInput = styled.input`
  width: 100%;
  height: 36px;
  padding: 12px 36px 12px 40px;
  border: 1px solid var(--colors-gray-400);
  border-radius: 16px;
  background-color: var(--colors-blank);
  color: var(--colors-gray-700);
  font-size: ${({ theme }) => theme.typography.size.sm};
  transition: border-color 0.15s ease;

  &::placeholder {
    color: var(--colors-gray-400);
  }

  &:hover {
    border-color: var(--colors-gray);
  }

  &:focus-visible {
    outline: none;
    border-color: var(--colors-brand);
    box-shadow: 0 0 0 3px rgba(98, 77, 227, 0.15);
  }
`;

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
  color: var(--colors-gray-500);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  line-height: 1;
  padding: 0;
  transition: background 0.15s ease;

  &:hover {
    background: var(--colors-gray-400);
    color: var(--colors-blank);
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
