import styled from 'styled-components';

type Props = {
  size?: 'sm' | 'md';
};

const sizes = {
  sm: '28px',
  md: '36px',
};

export const IconButton = styled.button<Props>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ size = 'md' }) => sizes[size]};
  height: ${({ size = 'md' }) => sizes[size]};
  padding: 0;
  border: none;
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--colors-gray-600);
  cursor: pointer;
  transition: background-color var(--transition-fast), color var(--transition-fast);

  &:hover:not(:disabled) {
    background-color: var(--colors-gray-100);
    color: var(--colors-gray-900);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--colors-blank), 0 0 0 4px var(--colors-brand);
  }

  svg {
    width: ${({ size = 'md' }) => (size === 'sm' ? '14px' : '18px')};
    height: ${({ size = 'md' }) => (size === 'sm' ? '14px' : '18px')};
  }
`;
