import styled from 'styled-components';

export const BodyContainer = styled.tbody`
  position: relative;
  background-color: var(--colors-blank);
`;

export const LoadingCell = styled.td`
  height: 200px;
  text-align: center;

  > div {
    display: inline-block;
  }
`;
