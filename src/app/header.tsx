import { ReactElement } from 'react';
import styled from 'styled-components';
import { Profile } from '../ui-kit/profile';
import { ThemeToggle } from '../ui-kit/theme-toggle';

const Wrapper = styled.header`
  background-color: var(--colors-blank);
  border-bottom: 1px solid var(--colors-gray-200);
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
  gap: 8px;
`;

export const AppHeader = (): ReactElement => {
  return (
    <Wrapper>
      <Inner>
        <ThemeToggle />
        <Profile
          name="Julie Howard"
          role="Admin"
          picUrl="https://avatars.githubusercontent.com/u/76113666?v=4"
        />
      </Inner>
    </Wrapper>
  );
};
