import styled from 'styled-components';

type Status = 'active' | 'onboarding' | 'offboarded';

const STATUS_COLORS: Record<Status, { dotDark: string; dotLight: string; bg: string; text: string }> = {
  active:     { dotDark: 'var(--Green-Light-700)', dotLight: 'var(--Green-Light-500)', bg: 'var(--colors-success-bg)', text: 'var(--colors-success)' },
  onboarding: { dotDark: '#6941C6', dotLight: '#D9D6FE', bg: 'var(--colors-brand-subtle)', text: 'var(--colors-brand)' },
  offboarded: { dotDark: 'var(--Grey-600)', dotLight: 'var(--Grey-400)', bg: '#F2F4F7', text: '#667085' },
};

const Dot = styled.span<{ $dark: string; $light: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: linear-gradient(90deg, ${({ $dark }) => $dark} 50%, ${({ $light }) => $light} 50%);
  flex-shrink: 0;
`;

const Wrapper = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: 500;
  line-height: 1.8;
  white-space: nowrap;
  color: var(--colors-gray-700);
`;

type Props = {
  status: Status;
};

export const Badge = ({ status }: Props) => {
  const { dotDark, dotLight } = STATUS_COLORS[status] ?? STATUS_COLORS.offboarded;
  const label = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <Wrapper aria-label={`Status: ${label}`}>
      <Dot $dark={dotDark} $light={dotLight} aria-hidden="true" />
      {label}
    </Wrapper>
  );
};
