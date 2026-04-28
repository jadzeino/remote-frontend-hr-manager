import { ComponentPropsWithoutRef, ReactElement } from 'react';
import styled from 'styled-components';
import CheckIcon from '../theme/icons/check.svg';

const Container = styled.label`
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--colors-gray-400);
  background-color: var(--colors-blank);
  gap: 8px;
  cursor: pointer;
  transition: border-color 0.15s ease, background-color 0.15s ease;

  &:hover {
    border-color: var(--colors-brand);
  }

  &:has(input:checked) {
    border-color: var(--colors-brand);
    background-color: rgba(98, 77, 227, 0.06);
  }
`;

const Input = styled.input`
  display: none;
`;

const Tick = styled.span`
  position: relative;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 2px solid var(--colors-gray-400);
  background-color: var(--colors-blank);
  transition: all 0.2s ease;
  flex-shrink: 0;
  background-repeat: no-repeat;
  background-image: url(${CheckIcon});
  background-position: center;
  background-size: 15px;

  ${Input}:hover + & {
    border-color: var(--colors-gray);
  }

  ${Input}:focus + & {
    border-color: var(--colors-brand);
  }

  ${Input}:checked + & {
    background-color: var(--colors-brand);
    border-color: var(--colors-brand);
  }
`;

const Label = styled.span`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: var(--colors-gray-700);
  user-select: none;
`;

type Props = Omit<ComponentPropsWithoutRef<'input'>, 'type'> & {
  label: string;
};

export const Checkbox = (props: Props): ReactElement => {
  const { label, ...rest } = props;

  return (
    <Container>
      <Input type="checkbox" {...rest} />
      <Tick />
      <Label>{label}</Label>
    </Container>
  );
};
