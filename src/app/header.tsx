import { ReactElement } from 'react';
import styled from 'styled-components';
import { Profile } from '../ui-kit/profile';

const Wrapper = styled.header`
  background-color: var(--colors-blank);
  width: 100%;
`;

const Inner = styled.div`
  margin: 0 auto;
  height: 80px;
  max-width: var(--layout-width);
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const AppHeader = (): ReactElement => {
  return (
    <Wrapper>
      <Inner>
        <Profile
          name="Julie Howard"
          role="Admin"
          picUrl="https://avatars.githubusercontent.com/u/76113666?v=4"
        />
      </Inner>
    </Wrapper>
  );
};
