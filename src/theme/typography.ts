import { css } from 'styled-components';

const rem = (size: string) => `${parseInt(size) / 10}rem`;

function getTextStyles(
  fontWeight: number,
  fontSize: string,
  lineHeight: number
) {
  return css`
    font-weight: ${fontWeight};
    font-size: ${rem(fontSize)};
    line-height: ${lineHeight};
    margin: 0;
  `;
}

export const themeTypographySize = {
  lg: '1.6rem',
  md: '1.6rem',
  sm: '1.4rem',
  smXS: '1.3rem',
  xs: '1.2rem',
};

export const themeTypography = {
  size: themeTypographySize,
  h1: getTextStyles(500, '30px', 1.34),
  h2: getTextStyles(500, '24px', 1.23),
  h3: getTextStyles(500, '24px', 1.25),
  h4: getTextStyles(500, '22px', 1.28),

  bodyLead: getTextStyles(400, '18px', 1.44),

  body: getTextStyles(400, '16px', 1.5),
  bodyM: getTextStyles(500, '16px', 1.5),
  bodyB: getTextStyles(600, '16px', 1.5),

  bodySM: getTextStyles(400, '14px', 1.29),
  bodySMB: getTextStyles(600, '14px', 1.29),
  bodySMXS: getTextStyles(400, '13px', 1.23),

  bodyXS: getTextStyles(400, '12px', 1.23),
};

declare module 'styled-components' {
  export interface DefaultTheme {
    typography: typeof themeTypography;
  }
}
