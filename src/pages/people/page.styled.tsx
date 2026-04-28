import styled from 'styled-components';

export const Container = styled.main`
  margin: 0 auto;
  width: 100%;
  max-width: var(--layout-width);
  overflow: auto;
`;

export const Title = styled.p`
  ${({ theme }) => theme.typography.h1};
  margin: 24px 0;
`;

export const Toolbar = styled.div`
  display: flex;

  justify-content: space-between;
  margin-bottom: 16px;
`;

export const Filters = styled.div`
  display: flex;
  gap: 12px;
`;
