import styled from 'styled-components';

type Props = {
  active?: boolean;
  disabled?: boolean;
};

export const DisclosureButton = styled.button<Props>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 14px;
  border: 1px solid ${({ active }) => (active ? 'var(--colors-brand)' : 'var(--colors-gray-500)')};
  border-radius: var(--radius-pill);
  background: ${({ active }) => (active ? 'var(--colors-brand-subtle)' : 'var(--colors-blank)')};
  color: ${({ active }) => (active ? 'var(--colors-brand)' : 'var(--colors-gray-700)')};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-family: inherit;
  font-weight: 400;
  cursor: pointer;
  white-space: nowrap;
  transition: border-color var(--transition-fast), background-color var(--transition-fast),
    color var(--transition-fast), box-shadow var(--transition-fast);

  &:hover:not(:disabled) {
    border-color: var(--colors-brand);
    background-color: var(--colors-brand-subtle);
    color: var(--colors-brand);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--colors-blank), 0 0 0 4px var(--colors-brand);
    border-color: var(--colors-brand);
  }
`;
