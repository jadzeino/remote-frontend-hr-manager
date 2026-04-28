import styled from 'styled-components';

const Chip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border: 1px solid var(--colors-brand);
  border-radius: 16px;
  background-color: #f0eeff;
  color: var(--colors-brand);
  font-size: 1.2rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;

  &:hover {
    background-color: var(--colors-brand);
    color: var(--colors-blank);
  }

  svg {
    width: 12px;
    height: 12px;
  }
`;

type Props = {
  label: string;
  onRemove: () => void;
};

export const FilterChip = ({ label, onRemove }: Props) => {
  return (
    <Chip
      type="button"
      onClick={onRemove}
      aria-label={`Remove filter: ${label}`}
    >
      {label}
      <span aria-hidden="true">×</span>
    </Chip>
  );
};
