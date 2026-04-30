import styled from 'styled-components';

type Props = {
  open: boolean;
  align?: 'left' | 'right';
  minWidth?: string;
};

export const DisclosurePanel = styled.div<Props>`
  position: absolute;
  top: calc(100% + 6px);
  ${({ align = 'left' }) => (align === 'right' ? 'right: 0;' : 'left: 0;')}
  min-width: ${({ minWidth = '160px' }) => minWidth};
  background: var(--colors-blank);
  border: 1px solid var(--colors-gray-200);
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  z-index: 100;
  pointer-events: ${({ open }) => (open ? 'auto' : 'none')};
  opacity: ${({ open }) => (open ? 1 : 0)};
  transform: ${({ open }) => (open ? 'translateY(0)' : 'translateY(-6px)')};
  transition: opacity var(--transition-fast), transform var(--transition-fast);
`;
