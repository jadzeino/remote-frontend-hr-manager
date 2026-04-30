import { ComponentPropsWithoutRef, ReactElement } from 'react';
import styled from 'styled-components';
import CheckIcon from '../theme/icons/check.svg?react';

const Input = styled.input`
  /* visually hidden but focusable for keyboard navigation */
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
`;

const Tick = styled.span`
  position: relative;
  width: 16px;
  height: 16px;
  border-radius: 5px;
  border: 1px solid var(--checkbox-tick-color, var(--colors-gray-500, #697786));
  background-color: var(--colors-blank);
  transition: border-color 0.15s ease, background-color 0.15s ease;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    display: none;
    width: 12.8px;
    height: 12.8px;
  }

  ${Input}:checked + & {
    background-color: var(--colors-brand);
    border-color: var(--colors-brand);

    svg {
      display: block;
    }
  }
`;

const Label = styled.span`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: var(--colors-gray-700);
  user-select: none;
`;

const Container = styled.label`
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 9999px;
  border: 1px solid var(--colors-gray-500, #697786);
  background-color: var(--colors-blank);
  gap: 8px;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    border-color: var(--colors-brand);
    background-color: var(--colors-brand-subtle);
    --checkbox-tick-color: var(--colors-brand);
  }

  &:has(${Input}:checked) {
    border-color: var(--colors-brand);
  }

  &:focus-within {
    border-color: var(--colors-brand);
    --checkbox-tick-color: var(--colors-brand);
    outline: none;
    box-shadow: 0 0 0 2px var(--colors-blank), 0 0 0 4px var(--colors-brand-focus);
  }

  &:has(${Input}:disabled) {
    opacity: 0.45;
    cursor: not-allowed;

    &:hover {
      border-color: var(--colors-gray-500, #697786);
      background-color: var(--colors-blank);
      --checkbox-tick-color: var(--colors-gray-500, #697786);
    }
  }
`;

type Props = Omit<ComponentPropsWithoutRef<'input'>, 'type'> & {
  label: string;
};

export const Checkbox = (props: Props): ReactElement => {
  const { label, ...rest } = props;

  return (
    <Container>
      <Input type="checkbox" {...rest} />
      <Tick>
        <CheckIcon />
      </Tick>
      <Label>{label}</Label>
    </Container>
  );
};
