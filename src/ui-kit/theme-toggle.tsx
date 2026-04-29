import { ReactElement } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useColorScheme } from '@/shared/hooks/useColorScheme';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const IconWrap = styled.span<{ $dark: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.35s ease, opacity 0.2s ease;

  ${({ $dark }) =>
    $dark &&
    css`
      animation: ${spin} 0.4s ease-out 1;
    `}
`;

const Btn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1.5px solid var(--colors-gray-200);
  background: var(--colors-blank);
  color: var(--colors-gray-600);
  cursor: pointer;
  flex-shrink: 0;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    border-color: var(--colors-brand);
    color: var(--colors-brand);
    background: var(--colors-gray-100);
  }

  &:focus-visible {
    outline: 3px solid rgba(98, 77, 227, 0.35);
    outline-offset: 2px;
  }
`;

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        d="M12 3v2M12 19v2M3 12h2M19 12h2M5.64 5.64l1.42 1.42M16.95 16.95l1.41 1.41M5.64 18.36l1.42-1.42M16.95 7.05l1.41-1.41"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const ThemeToggle = (): ReactElement => {
  const { scheme, toggle } = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <Btn
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      <IconWrap $dark={isDark}>
        {isDark ? <SunIcon /> : <MoonIcon />}
      </IconWrap>
    </Btn>
  );
};
