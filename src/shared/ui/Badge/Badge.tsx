import styled from 'styled-components';

type Status = 'active' | 'onboarding' | 'offboarded';

const STATUS_COLORS: Record<Status, { dot: string; bg: string; text: string }> = {
  active: { dot: '#12B76A', bg: '#ECFDF3', text: '#027A48' },
  onboarding: { dot: '#9B8FEF', bg: '#F0EEFF', text: '#5B4FD4' },
  offboarded: { dot: '#98A2B3', bg: '#F2F4F7', text: '#667085' },
};

const Dot = styled.span<{ $color: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${({ $color }) => $color};
  flex-shrink: 0;
`;

const Wrapper = styled.span<{ $bg: string; $text: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 8px;
  border-radius: 16px;
  background-color: ${({ $bg }) => $bg};
  color: ${({ $text }) => $text};
  font-size: 1.2rem;
  font-weight: 500;
  line-height: 1.8;
  white-space: nowrap;
`;

type Props = {
  status: Status;
};

export const Badge = ({ status }: Props) => {
  const { dot, bg, text } = STATUS_COLORS[status] ?? STATUS_COLORS.offboarded;
  const label = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <Wrapper $bg={bg} $text={text} aria-label={`Status: ${label}`}>
      <Dot $color={dot} aria-hidden="true" />
      {label}
    </Wrapper>
  );
};
