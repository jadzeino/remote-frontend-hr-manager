import { ComponentPropsWithoutRef, ReactElement } from 'react';
import styled from 'styled-components';

const ChevronWrapper = styled.span`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--colors-gray-500);
  display: flex;
  align-items: center;
  transition: color 0.15s ease;
`;

const StyledSelect = styled.select`
  width: 100%;
  height: 34px;
  padding: 0 32px 0 12px;
  border: 1px solid var(--colors-gray-500, #697786);
  border-radius: 8px;
  background-color: var(--colors-blank);
  color: var(--colors-gray-700);
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-family: inherit;
  cursor: pointer;
  appearance: none;
  transition: border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;

  &::placeholder {
    color: var(--colors-gray-400);
  }

  &:focus-visible {
    outline: none;
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    background-color: var(--colors-gray-100);
  }
`;

const Container = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;

  &:hover ${StyledSelect}:not(:disabled) {
    border-color: #7f5af8;
    background-color: #f5f3ff;
  }

  &:hover:not(:has(${StyledSelect}:disabled)) ${ChevronWrapper} {
    color: #7f5af8;
  }

  &:focus-within ${StyledSelect}:not(:disabled) {
    border-color: #7f5af8;
    background-color: var(--colors-blank);
    box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #6638ef;
  }

  &:focus-within:not(:has(${StyledSelect}:disabled)) ${ChevronWrapper} {
    color: #7f5af8;
  }
`;

type Props = ComponentPropsWithoutRef<'select'>;

export const Dropdown = ({ children, ...props }: Props): ReactElement => (
  <Container>
    <StyledSelect {...props}>
      {children}
    </StyledSelect>
    <ChevronWrapper aria-hidden="true">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </ChevronWrapper>
  </Container>
);
