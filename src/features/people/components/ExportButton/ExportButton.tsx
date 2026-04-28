import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ExportFormat } from '../../utils/exportData';

const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
`;

const MainBtn = styled.button`
  display: inline-flex;
  align-items: center;
  height: 44px;
  padding: 0 16px;
  border: 1.5px solid var(--colors-gray-300);
  border-right: none;
  border-radius: 24px 0 0 24px;
  background: var(--colors-blank);
  color: var(--colors-gray-700);
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s ease, border-color 0.15s ease;

  &:hover:not(:disabled) {
    background: var(--colors-gray-100);
    border-color: var(--colors-gray);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ChevronBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 44px;
  border: 1.5px solid var(--colors-gray-300);
  border-radius: 0 24px 24px 0;
  background: var(--colors-blank);
  color: var(--colors-gray-500);
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;

  &:hover:not(:disabled) {
    background: var(--colors-gray-100);
    border-color: var(--colors-gray);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 12px;
    height: 12px;
    transition: transform 0.15s ease;
  }
`;

const Dropdown = styled.ul<{ $open: boolean }>`
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 140px;
  margin: 0;
  padding: 4px 0;
  list-style: none;
  background: var(--colors-blank);
  border: 1px solid var(--colors-gray-200);
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  z-index: 100;
  pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transform: ${({ $open }) => ($open ? 'translateY(0)' : 'translateY(-6px)')};
  transition: opacity 0.15s ease, transform 0.15s ease;
`;

const DropdownItem = styled.li<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  font-size: 1.3rem;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ $active }) => ($active ? 'var(--colors-brand)' : 'var(--colors-gray-700)')};
  cursor: pointer;
  user-select: none;

  &:hover {
    background: var(--colors-gray-100);
  }
`;

const Badge = styled.span`
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

      <Dropdown $open={open} role="menu">
        {FORMATS.map((f) => (
          <DropdownItem
            key={f.value}
            $active={f.value === format}
            role="menuitemradio"
            aria-checked={f.value === format}
            onClick={() => { setFormat(f.value); setOpen(false); }}
          >
            {f.label}
            <Badge>{f.badge}</Badge>
          </DropdownItem>
        ))}
      </Dropdown>
    </Wrapper>
  );
};
