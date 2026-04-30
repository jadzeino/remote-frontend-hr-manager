import { ReactElement, ReactNode } from 'react';
import type { DefaultTheme } from 'styled-components';
import {
  ThemeProvider as Provider,
  createGlobalStyle,
} from 'styled-components';
import { normalize } from 'styled-normalize';
import { themeColor, darkThemeColor } from './color';
import { themeTokens } from './tokens';
import './fonts/styles.css';
import { themeTypography } from './typography';

const theme: DefaultTheme = {
  typography: themeTypography,
};

const GlobalStyle = createGlobalStyle`
  ${normalize}
  
  :root {
    ${themeColor}
    ${themeTokens}

    --font-primary: "Inter", sans-serif;
    --layout-width: 1100px;

    --z-index-table-head: 2;
    --z-index-table-row: 1;
  }

  ${darkThemeColor}

  html {
    font-size: 62.5%; /* 1rem = 10px */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: var(--font-primary);
    box-sizing: border-box;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  body {
    ${({ theme }) => theme.typography.body};
    color: var(--colors-darkBlue);
    background-color: var(--colors-bgBase);
  }
`;

export const ThemeProvider = (props: { children: ReactNode }): ReactElement => {
  const { children } = props;

  return (
    <Provider theme={theme}>
      <GlobalStyle />
      {children}
    </Provider>
  );
};
