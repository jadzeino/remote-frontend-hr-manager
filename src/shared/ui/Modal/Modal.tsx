import {
  ReactNode,
  useEffect,
  useRef,
  KeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  animation: fadeIn 0.15s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const Panel = styled.div`
  background: var(--colors-blank);
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  animation: slideUp 0.2s ease;

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  ${({ theme }) => theme.typography.h3}
  margin: 0;
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--colors-gray-500);
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;

  &:hover {
    background: var(--colors-gray-100);
    color: var(--colors-gray-700);
  }
`;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export const Modal = ({ isOpen, onClose, title, children }: Props) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      panelRef.current?.focus();
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <Backdrop onClick={onClose} role="presentation">
      <Panel
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <Header>
          <Title id="modal-title">{title}</Title>
          <CloseButton onClick={onClose} aria-label="Close modal">
            ×
          </CloseButton>
        </Header>
        {children}
      </Panel>
    </Backdrop>,
    document.body
  );
};
