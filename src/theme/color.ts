import { css } from 'styled-components';

/**
 * @todo Put this into styled-component's theme, similar to "typography", so
 * we can have strict typing.
 */
export const themeColor = css`
  --colors-brand: #624de3;
  --colors-darkBlue: #00234b;
  --colors-redPink: #ff4a5a;

  --colors-bgBase: #F3F4F8;
  --colors-gray-900: #0F1419;
  --colors-gray-800: #222E39;
  --colors-gray-700: #364452;
  --colors-gray-600: #4B5865;
  --colors-gray-500: #697786;
  --colors-gray-400: #9AA6B2;
  --colors-gray-300: #CDD6DF;
  --colors-gray-200: #E3E9EF;
  --colors-gray-100: #EEF2F6;
  --colors-gray-50: #F8FAFC;

  --colors-blank: #ffffff;

  /* Named aliases used as var() fallbacks in components */
  --Grey-900: #0F1419;
  --Grey-600: #4B5865;
  --Grey-400: #9AA6B2;
  --Green-Light-700: #58A30D;
  --Green-Light-500: #8DE13A;
`;

/* Dark palette — muted blue-slate scale, brand lightened for contrast */
export const darkThemeColor = css`
  [data-theme="dark"] {
    --colors-brand: #8B78F0;
    --colors-darkBlue: #E8EEF5;
    --colors-redPink: #FF7B8A;

    --colors-bgBase: #0F1520;
    --colors-gray-900: #EDF2F7;
    --colors-gray-800: #D0DAE5;
    --colors-gray-700: #B0BFCC;
    --colors-gray-600: #8496A5;
    --colors-gray-500: #5E7282;
    --colors-gray-400: #3D5060;
    --colors-gray-300: #253240;
    --colors-gray-200: #1B2738;
    --colors-gray-100: #152030;
    --colors-gray-50: #0F1A28;

    --colors-blank: #172132;

    --Grey-900: #EDF2F7;
    --Grey-600: #8496A5;
    --Grey-400: #3D5060;
    --Green-Light-700: #7EC93A;
    --Green-Light-500: #AEED6A;
  }
`;
