import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useSalaryBounds } from '../../hooks/useSalaryBounds';

const CURRENCIES = ['All', 'USD', 'EUR', 'GBP'] as const;
const STEP = 100000;

function fmt(cents: number, currency: string): string {
  const val = Math.round(cents / 100);
  const symbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';
  const short = val >= 1000 ? `${Math.round(val / 1000)}k` : `${val}`;
  return `${symbol}${short}`;
}

// ─── Styled components ────────────────────────────────────────────────────────

const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
`;

const TriggerBtn = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 12px;
  border: 1px solid ${({ $active }) => ($active ? 'var(--colors-brand)' : 'var(--colors-gray-400)')};
  border-radius: 8px;
  background: ${({ $active }) => ($active ? '#f0eeff' : 'var(--colors-blank)')};
  color: ${({ $active }) => ($active ? 'var(--colors-brand)' : 'var(--colors-gray-600)')};
  font-size: 1.3rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    border-color: var(--colors-brand);
    color: var(--colors-brand);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

const ActiveDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--colors-brand);
  flex-shrink: 0;
`;

const Panel = styled.div<{ $open: boolean }>`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: 300px;
  background: var(--colors-blank);
  border: 1px solid var(--colors-gray-200);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  z-index: 200;
  padding: 16px;
  pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transform: ${({ $open }) => ($open ? 'translateY(0)' : 'translateY(-6px)')};
  transition: opacity 0.15s ease, transform 0.15s ease;
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const PanelTitle = styled.span`
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--colors-darkBlue);
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CurrencySelect = styled.select`
  height: 28px;
  padding: 0 24px 0 8px;
  border: 1px solid var(--colors-gray-300);
  border-radius: 6px;
  background: var(--colors-blank);
  color: var(--colors-gray-700);
  font-size: 1.2rem;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' fill='%23617798'%3E%3Cpath clip-rule='evenodd' d='M14.78 5.47c.3.3.3.77 0 1.06L9.31 12l5.47 5.47a.75.75 0 1 1-1.06 1.06l-6-6a.75.75 0 0 1 0-1.06l6-6c.3-.3.77-.3 1.06 0z' fill-rule='evenodd' transform='rotate(-90 12 12)'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 4px center;
  background-size: 12px;
  transition: border-color 0.15s ease;

  &:hover { border-color: var(--colors-brand); }
`;

const ResetBtn = styled.button`
  border: none;
  background: none;
  font-size: 1.3rem;
  color: var(--colors-gray-500);
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  transition: color 0.15s;
  &:hover:not(:disabled) { color: var(--colors-gray-700); }
  &:disabled { opacity: 0.35; cursor: not-allowed; text-decoration: none; }
`;

const SliderWrapper = styled.div`
  position: relative;
  height: 20px;
  margin: 12px 0 8px;
`;

const SliderTrack = styled.div<{ $left: number; $right: number }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  right: 0;
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(
    to right,
    var(--colors-gray-200) ${({ $left }) => $left}%,
    var(--colors-brand) ${({ $left }) => $left}%,
    var(--colors-brand) ${({ $right }) => $right}%,
    var(--colors-gray-200) ${({ $right }) => $right}%
  );
  pointer-events: none;
`;

const RangeInput = styled.input<{ $zIndex: number }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  height: 4px;
  margin: 0;
  appearance: none;
  background: transparent;
  pointer-events: none;
  z-index: ${({ $zIndex }) => $zIndex};

  &::-webkit-slider-thumb {
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--colors-blank);
    border: 2px solid var(--colors-brand);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    pointer-events: all;
    transition: box-shadow 0.15s ease;
    &:hover { box-shadow: 0 0 0 4px rgba(98, 77, 227, 0.15); }
  }

  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--colors-blank);
    border: 2px solid var(--colors-brand);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    pointer-events: all;
  }
`;

const ValuesRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin: 4px 0 12px;
`;

const ValBox = styled.div`
  display: inline-flex;
  align-items: center;
  height: 32px;
  padding: 0 10px;
  border: 1px solid var(--colors-gray-300);
  border-radius: 6px;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--colors-darkBlue);
  background: var(--colors-gray-50, #fafafa);
  min-width: 64px;
  justify-content: center;
`;

const ToLabel = styled.span`
  font-size: 1.3rem;
  color: var(--colors-gray-400);
`;

const BoundsRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
  color: var(--colors-gray-400);
`;

const Divider = styled.div`
  height: 1px;
  background: var(--colors-gray-100);
  margin: 12px 0 8px;
`;

const FooterNote = styled.p`
  font-size: 1.1rem;
  color: var(--colors-gray-400);
  margin: 0 0 12px;
`;

const ApplyBtn = styled.button`
  width: 100%;
  height: 36px;
  border: none;
  border-radius: 8px;
  background: var(--colors-brand);
  color: var(--colors-blank);
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover { background: #4f3bc0; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

// ─── Component ────────────────────────────────────────────────────────────────

type Props = {
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: string;
  disabled?: boolean;
  onApplySalaryFilter: (min: number, max: number, currency: string) => void;
  onClearSalary: () => void;
};

export const SalaryRangeFilter = ({
  salaryMin,
  salaryMax,
  salaryCurrency,
  disabled,
  onApplySalaryFilter,
  onClearSalary,
}: Props) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Local draft state — nothing is applied until Apply is clicked
  const [localCurrency, setLocalCurrency] = useState<string>(salaryCurrency || 'All');
  const [localMin, setLocalMin] = useState(salaryMin > 0 ? salaryMin : 0);
  const [localMax, setLocalMax] = useState(salaryMax > 0 ? salaryMax : 0);

  const { bounds, isLoading } = useSalaryBounds(localCurrency === 'All' ? null : localCurrency);

  // When bounds load (on mount or currency change), reset slider to bounds
  // but respect any already-applied range if currency matches
  const boundsKey = `${bounds.min}:${bounds.max}`;
  useEffect(() => {
    if (!bounds.min || !bounds.max) return;
    const currencyMatches = localCurrency === (salaryCurrency || 'All');
    setLocalMin((prev) => (currencyMatches && prev > 0) ? prev : (currencyMatches && salaryMin > 0 ? salaryMin : bounds.min));
    setLocalMax((prev) => (currencyMatches && prev > 0) ? prev : (currencyMatches && salaryMax > 0 ? salaryMax : bounds.max));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boundsKey]);

  // When panel opens, sync draft from currently applied state
  useEffect(() => {
    if (open) setLocalCurrency(salaryCurrency || 'All');
  }, [open, salaryCurrency]);

  // Click-outside to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleCurrencyChange = (c: string) => {
    setLocalCurrency(c);
    // bounds effect will fire when new bounds arrive and reset slider
  };

  const handleReset = () => {
    if (!bounds.min || !bounds.max) return;
    setLocalMin(bounds.min);
    setLocalMax(bounds.max);
    setLocalCurrency('All');
    onClearSalary();
  };

  const handleApply = () => {
    const currency = localCurrency === 'All' ? '' : localCurrency;
    const atBounds = localMin <= bounds.min && localMax >= bounds.max;
    onApplySalaryFilter(atBounds ? 0 : localMin, atBounds ? 0 : localMax, currency);
    setOpen(false);
  };

  const handleMinChange = (v: number) => setLocalMin(Math.min(v, localMax - STEP));
  const handleMaxChange = (v: number) => setLocalMax(Math.max(v, localMin + STEP));

  const range = bounds.max - bounds.min || 1;
  const leftPct = ((localMin - bounds.min) / range) * 100;
  const rightPct = ((localMax - bounds.min) / range) * 100;

  const isActive = salaryMin > 0 || salaryMax > 0 || Boolean(salaryCurrency);
  const displaySymbol = salaryCurrency === 'EUR' ? '€' : salaryCurrency === 'GBP' ? '£' : '$';

  return (
    <Wrapper ref={wrapperRef}>
      <TriggerBtn
        type="button"
        $active={isActive}
        disabled={disabled}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {isActive && <ActiveDot aria-hidden="true" />}
        {isActive
          ? `${displaySymbol} Salary`
          : `$ Salary`}
      </TriggerBtn>

      <Panel $open={open} role="dialog" aria-label="Salary range filter">
        <PanelHeader>
          <PanelTitle>Salary range</PanelTitle>
          <HeaderRight>
            <CurrencySelect
              value={localCurrency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              aria-label="Currency"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c === 'All' ? 'All currencies' : `$ ${c}`}</option>
              ))}
            </CurrencySelect>
            <ResetBtn
              type="button"
              onClick={handleReset}
              disabled={
                localCurrency === 'All' &&
                (!bounds.min || (localMin <= bounds.min && localMax >= bounds.max))
              }
            >
              Reset
            </ResetBtn>
          </HeaderRight>
        </PanelHeader>

        {isLoading || !bounds.min ? (
          <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--colors-gray-400)', fontSize: '1.3rem' }}>
            Loading…
          </div>
        ) : (
          <>
            <SliderWrapper>
              <SliderTrack $left={leftPct} $right={rightPct} />
              <RangeInput
                type="range"
                min={bounds.min}
                max={bounds.max}
                step={STEP}
                value={localMin}
                $zIndex={localMin >= bounds.max - STEP ? 2 : 1}
                onChange={(e) => handleMinChange(Number(e.target.value))}
                aria-label="Minimum salary"
                disabled={disabled}
              />
              <RangeInput
                type="range"
                min={bounds.min}
                max={bounds.max}
                step={STEP}
                value={localMax}
                $zIndex={1}
                onChange={(e) => handleMaxChange(Number(e.target.value))}
                aria-label="Maximum salary"
                disabled={disabled}
              />
            </SliderWrapper>

            <ValuesRow>
              <ValBox>{fmt(localMin, localCurrency)}</ValBox>
              <ToLabel>to</ToLabel>
              <ValBox>{fmt(localMax, localCurrency)}</ValBox>
            </ValuesRow>

            <BoundsRow>
              <span>{fmt(bounds.min, localCurrency)}</span>
              <span>{fmt(bounds.max, localCurrency)}</span>
            </BoundsRow>

            <Divider />

            <FooterNote>
              {localCurrency === 'All'
                ? 'Comparing raw values across currencies.'
                : `Salaries filtered by ${localCurrency}.`}
            </FooterNote>

            <ApplyBtn type="button" onClick={handleApply} disabled={disabled}>
              Apply
            </ApplyBtn>
          </>
        )}
      </Panel>
    </Wrapper>
  );
};
