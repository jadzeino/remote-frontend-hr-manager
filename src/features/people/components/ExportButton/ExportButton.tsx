import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { DisclosurePanel } from '@/ui-kit/disclosure-panel';
import { ExportFormat } from '../../utils/exportData';

const MainBtn = styled.button`
  display: inline-flex;
  align-items: center;
  height: 34px;
  padding: 0 14px;
  border: 1px solid var(--colors-gray-500);
  border-right: none;
  border-radius: 9999px 0 0 9999px;
  background: var(--colors-blank);
  color: var(--colors-gray-700);
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-family: inherit;
  font-weight: 400;
  cursor: pointer;
  white-space: nowrap;
  transition: border-color var(--transition-fast), background-color var(--transition-fast), color var(--transition-fast), box-shadow var(--transition-fast);

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--colors-blank), 0 0 0 4px var(--colors-brand-focus);
    border-color: var(--colors-brand);
    z-index: 1;
  }
`;

const ChevronBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 34px;
  border: 1px solid var(--colors-gray-500);
  border-radius: 0 9999px 9999px 0;
  background: var(--colors-blank);
  color: var(--colors-gray-500);
  cursor: pointer;
  transition: border-color var(--transition-fast), background-color var(--transition-fast), color var(--transition-fast), box-shadow var(--transition-fast);

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--colors-blank), 0 0 0 4px var(--colors-brand-focus);
    border-color: var(--colors-brand);
    z-index: 1;
  }

  svg {
    width: 12px;
    height: 12px;
    transition: transform 0.15s ease;
  }
`;

const Wrapper = styled.div`
  position: relative;
  display: inline-flex;

  &:hover ${MainBtn}:not(:disabled),
  &:hover ${ChevronBtn}:not(:disabled) {
    border-color: var(--colors-brand);
    background-color: var(--colors-brand-subtle);
    color: var(--colors-brand);
  }
`;

const Dropdown = styled(DisclosurePanel)`
  min-width: 140px;
  margin: 0;
  padding: 4px 0;
  list-style: none;
`;

const DropdownItem = styled.li<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  font-size: ${({ theme }) => theme.typography.size.smXS};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ $active }) => ($active ? 'var(--colors-brand)' : 'var(--colors-gray-700)')};
  cursor: pointer;
  user-select: none;

  &:hover {
    background: var(--colors-gray-100);
  }
`;

const BadgeLabel = styled.span`
  margin-left: auto;
  font-size: 1rem;
  color: var(--colors-gray-400);
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const FORMATS: { value: ExportFormat; label: string; badge: string }[] = [
  { value: 'csv',  label: 'Spreadsheet CSV',  badge: '.csv'  },
  { value: 'xlsx', label: 'Excel Workbook',    badge: '.xlsx' },
  { value: 'json', label: 'JSON',              badge: '.json' },
];

type Props = {
  onExport: (format: ExportFormat) => void;
  isExporting: boolean;
  disabled?: boolean;
};

export const ExportButton = ({ onExport, isExporting, disabled }: Props) => {
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const currentLabel = FORMATS.find((f) => f.value === format)?.badge.toUpperCase() ?? 'CSV';

  return (
    <Wrapper ref={wrapperRef}>
      <MainBtn
        type="button"
        disabled={disabled || isExporting}
        onClick={() => onExport(format)}
      >
        {isExporting ? 'Exporting…' : `Export ${currentLabel}`}
      </MainBtn>

      <ChevronBtn
        type="button"
        disabled={disabled || isExporting}
        aria-label="Choose export format"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: open ? 'rotate(180deg)' : undefined }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </ChevronBtn>

      <Dropdown as="ul" open={open} align="right" role="menu">
        {FORMATS.map((f) => (
          <DropdownItem
            key={f.value}
            $active={f.value === format}
            role="menuitemradio"
            aria-checked={f.value === format}
            onClick={() => { setFormat(f.value); setOpen(false); }}
          >
            {f.label}
            <BadgeLabel>{f.badge}</BadgeLabel>
          </DropdownItem>
        ))}
      </Dropdown>
    </Wrapper>
  );
};
