import { ComponentPropsWithoutRef, ReactElement } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { SROnly } from './sr-only';

const StyledButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: 500;
  line-height: 1;
  min-height: 44px;
  padding: 12px 24px;
  border-radius: 24px;
  transition: background 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;

  ${({ $variant }) =>
    $variant === 'secondary'
      ? css`
          border: 1.5px solid var(--colors-gray-300);
          background: var(--colors-blank);
          color: var(--colors-gray-700);
          &:hover:not(:disabled) {
            border-color: var(--colors-gray);
            background: var(--colors-gray-100);
          }
        `
      : css`
          border: none;
          background: var(--colors-brand);
          color: var(--colors-blank);
          &:hover:not(:disabled) {
            background: #4f3bc0;
          }
        `}

  &:focus-visible {
    outline: 3px solid rgba(98, 77, 227, 0.35);
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

type LabelProps = {
  $isLoading?: boolean;
};

const StyledLabel = styled.span<LabelProps>`
  transition: color 250ms;

  ${({ theme }) => theme.typography.bodyM}

  ${({ $isLoading }) =>
    $isLoading &&
    css`
      color: transparent;
    `}
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const StyledSpinner = styled.span`
  position: absolute;
  display: block;
  width: 1em;
  height: 1em;
  top: calc(50% - 0.5em);
  left: calc(50% - 0.5em);
  border-width: 2px;
  border-color: inherit;
  border-bottom-color: transparent;
  border-left-color: transparent;
  border-style: solid;
  border-radius: 50%;
  animation: ${spin} 0.45s linear infinite;
`;

type Props = ComponentPropsWithoutRef<'button'> & LabelProps & { variant?: 'primary' | 'secondary' };

export const Button = (props: Props): ReactElement => {
  const { $isLoading, variant, children, ...rest } = props;

  return (
    <StyledButton type="button" $variant={variant} {...rest}>
      <StyledLabel $isLoading={$isLoading}>{children}</StyledLabel>
      {$isLoading && (
        <>
          <SROnly aria-live="assertive">Loading</SROnly>
          <StyledSpinner />
        </>
      )}
    </StyledButton>
  );
};
