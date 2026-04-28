import { ReactElement } from 'react';
import styled from 'styled-components';

const Container = styled.main`
  margin: 0 auto;
  width: 100%;
  max-width: var(--layout-width);
`;

export const AddEditPeoplePage = (): ReactElement => {
  return (
    <Container>
      <h1>Add a member.</h1>
      <p>
        Pretend this page is built, you just need to connect to it, you do not
        need to build it.
      </p>
    </Container>
  );
};
