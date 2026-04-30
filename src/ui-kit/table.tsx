import styled from 'styled-components';
import { CSS } from 'styled-components/dist/types';

export const Table = styled.table`
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0 0;
  ${({ theme }) => theme.typography.bodySM};
  color: var(--colors-gray-700);

  thead th {
    position: sticky;
    top: 0;
    z-index: 1;
  }

  thead {
    border-bottom: 4px solid var(--colors-blank);
  }
`;

export const TableRow = styled.tr`
  transition: background-color 150ms ease;

  &:hover {
    td {
      background-color: var(--colors-gray-100);
    }
  }
`;

type CellProps = {
  /**
   * Align text content of a cell.
   * This is different than the "align" HTML attribute.
   * Even though the "align" attribute is available out of the box,
   * we should not use it as it is deprecated.
   *
   * See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th#align
   */
  $textAlign?: CSS.Property.TextAlign;
};
export const TableThCell = styled.th<CellProps>`
  white-space: nowrap;
  padding: 18px 0 18px 16px;
  font-family: Inter, sans-serif;
  font-size: 10px;
  font-weight: 600;
  line-height: 16px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--Grey-600, #4B5865);
  background-color: var(--colors-gray-100);
  text-align: ${(props) => props.$textAlign ?? 'left'};

  &:last-child {
    padding-right: 20px;
  }
`;

export const TableCell = styled.td<CellProps>`
  padding: 12px 0 12px 16px;
  border-top: 1px solid var(--colors-gray-300);
  border-radius: 0;
  background-color: var(--colors-blank);
  text-align: ${(props) => props.$textAlign ?? 'left'};
  transition: background-color 150ms ease;

  &:last-child {
    padding-right: 20px;
  }

  ${TableRow}:first-child & {
    border-top: 0;
  }

`;
