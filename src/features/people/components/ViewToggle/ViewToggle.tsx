import styled from 'styled-components';
import { ViewMode } from '../../types';

const Wrapper = styled.div`
  display: inline-flex;
  border: 1px solid var(--colors-gray-300);
  border-radius: 8px;
  overflow: hidden;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  padding: 6px 14px;
  border: none;
  background: ${({ $active }) =>
    $active ? 'var(--colors-brand)' : 'var(--colors-blank)'};
  color: ${({ $active }) =>
    $active ? 'var(--colors-blank)' : 'var(--colors-gray-600)'};
  font-size: 1.3rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ $active }) =>
      $active ? 'var(--colors-brand)' : 'var(--colors-gray-100)'};
  }
`;

type Props = {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
};

export const ViewToggle = ({ value, onChange }: Props) => {
  return (
    <Wrapper role="group" aria-label="View mode">
      <ToggleButton
        type="button"
        $active={value === 'pagination'}
        onClick={() => onChange('pagination')}
        aria-pressed={value === 'pagination'}
      >
        Pagination
      </ToggleButton>
      <ToggleButton
        type="button"
        $active={value === 'infinite'}
        onClick={() => onChange('infinite')}
        aria-pressed={value === 'infinite'}
      >
        Infinite Scroll
      </ToggleButton>
    </Wrapper>
  );
};
