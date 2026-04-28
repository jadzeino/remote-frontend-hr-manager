import { ReactNode, useEffect, KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import styled, { css } from 'styled-components';

const Backdrop = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;

  ${({ $isOpen }) =>
    $isOpen &&
    css`
      opacity: 1;
      pointer-events: auto;
    `}
`;

const Panel = styled.aside<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 420px;
  max-width: 100vw;
  background: var(--colors-blank);
  z-index: 1001;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.12);
  overflow-y: auto;
  transform: translateX(100%);
  transition: transform 0.25s ease;

  ${({ $isOpen }) =>
    $isOpen &&
    css`
      transform: translateX(0);
    `}
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--colors-gray-200);
  position: sticky;
  top: 0;
  background: var(--colors-blank);
  z-index: 1;
`;

const Title = styled.h2`
  ${({ theme }) => theme.typography.h3}
  margin: 0;
  font-size: 1.8rem;
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

export const DrawerBody = styled.div`
  padding: 24px;
`;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export const Drawer = ({ isOpen, onClose, title, children }: Props) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Escape') onClose();
  };

  return createPortal(
    <>
      <Backdrop $isOpen={isOpen} onClick={onClose} role="presentation" />
      <Panel
        $isOpen={isOpen}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        onKeyDown={handleKeyDown}
      >
        <Header>
          <Title id="drawer-title">{title}</Title>
          <CloseButton onClick={onClose} aria-label="Close panel">
            ×
          </CloseButton>
        </Header>
        {isOpen && children}
      </Panel>
    </>,
    document.body
  );
};
