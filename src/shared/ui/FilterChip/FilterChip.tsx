import styled from 'styled-components';

const Chip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border: 1px solid var(--colors-brand);
  border-radius: 16px;
  background-color: var(--colors-brand-subtle);
  color: var(--colors-brand);
  font-size: 1.2rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background-color: var(--colors-brand);
    color: var(--colors-blank);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  svg {
    width: 12px;
    height: 12px;
  }
`;

type Props = {
  label: string;
  onRemove: () => void;
  disabled?: boolean;
};

export const FilterChip = ({ label, onRemove, disabled }: Props) => {
  return (
    <Chip
      type="button"
      onClick={onRemove}
      aria-label={`Remove filter: ${label}`}
      disabled={disabled}
    >
      {label}
      <span aria-hidden="true">×</span>
    </Chip>
  );
};
