import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAnalyticsStats } from '../../hooks/useAnalyticsStats';

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const CollapseToggle = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: none;
  background: none;
  padding: 0;
  font-size: 1.2rem;
  color: var(--colors-gray-500);
  cursor: pointer;
  align-self: flex-start;
  margin-bottom: 10px;

  &:hover { color: var(--colors-gray-700); }
`;

const Chevron = styled.span<{ $open: boolean }>`
  display: inline-block;
  transition: transform 0.2s ease;
  transform: rotate(${({ $open }) => ($open ? '0deg' : '-90deg')});
  font-size: 10px;
`;

const CardsRow = styled.div<{ $visible: boolean }>`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  overflow: hidden;
  max-height: ${({ $visible }) => ($visible ? '120px' : '0')};
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: max-height 0.25s ease, opacity 0.2s ease;
`;

const Card = styled.button<{ $active?: boolean; $accent: string }>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  background: var(--colors-blank);
  border: 1.5px solid ${({ $active, $accent }) => ($active ? $accent : 'transparent')};
  border-radius: 12px;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
  box-shadow: ${({ $active, $accent }) =>
    $active ? `0 0 0 3px ${$accent}22` : '0 1px 3px rgba(0,0,0,0.06)'};

  &:hover:not(:disabled) {
    border-color: ${({ $accent }) => $accent};
    box-shadow: 0 0 0 3px ${({ $accent }) => $accent}22;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const IconCircle = styled.span<{ $bg: string }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
`;

const CardText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const CardValue = styled.span`
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--colors-darkBlue);
  line-height: 1;
`;

const CardLabel = styled.span`
  font-size: 1.2rem;
  color: var(--colors-gray-500);
`;

const SkeletonCard = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  background: var(--colors-blank);
  border: 1.5px solid transparent;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
`;

const SkeletonPulse = styled.div<{ $w?: string; $h?: string; $radius?: string }>`
  width: ${({ $w }) => $w ?? '100%'};
  height: ${({ $h }) => $h ?? '14px'};
  border-radius: ${({ $radius }) => $radius ?? '6px'};
  background: linear-gradient(
    90deg,
    var(--colors-gray-100) 25%,
    var(--colors-gray-50) 50%,
    var(--colors-gray-100) 75%
  );
  background-size: 400px 100%;
  animation: ${shimmer} 1.4s infinite linear;
  flex-shrink: 0;
`;

type StatStatus = 'active' | 'onboarding' | 'offboarded';

type Props = {
  activeStatuses: string[];
  onToggleStatus: (s: StatStatus) => void;
  isFetching?: boolean;
};

const CARDS = [
  {
    key: null as null,
    icon: '👥',
    label: 'Total members',
    accent: '#624de3',
    bg: '#f0eeff',
  },
  {
    key: 'active' as StatStatus,
    icon: '✓',
    label: 'Active',
    accent: '#16a34a',
    bg: '#dcfce7',
  },
  {
    key: 'onboarding' as StatStatus,
    icon: '⟳',
    label: 'Onboarding',
    accent: '#2563eb',
    bg: '#dbeafe',
  },
  {
    key: 'offboarded' as StatStatus,
    icon: '○',
    label: 'Offboarded',
    accent: '#9ca3af',
    bg: '#f3f4f6',
  },
] as const;

export const AnalyticsBar = ({ activeStatuses, onToggleStatus, isFetching = false }: Props) => {
  const [open, setOpen] = useState(true);
  const { stats, isLoading } = useAnalyticsStats();

  const values: Record<string, number> = {
    total: stats.total,
    active: stats.active,
    onboarding: stats.onboarding,
    offboarded: stats.offboarded,
  };

  return (
    <Section>
      <CollapseToggle type="button" onClick={() => setOpen((o) => !o)}>
        <Chevron $open={open}>▼</Chevron>
        Analytics
      </CollapseToggle>

      <CardsRow $visible={open}>
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} aria-busy="true" aria-label="Loading stat">
                <SkeletonPulse $w="40px" $h="40px" $radius="10px" />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <SkeletonPulse $w="60%" $h="22px" />
                  <SkeletonPulse $w="80%" $h="12px" />
                </div>
              </SkeletonCard>
            ))
          : CARDS.map((card) => {
              const isActive = card.key !== null && activeStatuses.includes(card.key);
              const count = card.key === null ? values.total : values[card.key];
              return (
                <Card
                  key={card.label}
                  type="button"
                  $active={isActive}
                  $accent={card.accent}
                  onClick={() => card.key && onToggleStatus(card.key)}
                  aria-pressed={isActive}
                  title={card.key ? `Filter by ${card.label}` : undefined}
                  disabled={isFetching && card.key !== null}
                  style={card.key === null ? { cursor: 'default' } : undefined}
                >
                  <IconCircle $bg={card.bg}>{card.icon}</IconCircle>
                  <CardText>
                    <CardValue>{count.toLocaleString()}</CardValue>
                    <CardLabel>{card.label}</CardLabel>
                  </CardText>
                </Card>
              );
            })}
      </CardsRow>
    </Section>
  );
};
