import {
  render as orgRender,
  RenderOptions,
  RenderResult,
} from '@testing-library/react';
import { ReactElement } from 'react';
import { TestProviders } from './provider';

export { userEvent } from '@testing-library/user-event';

export { screen } from '@testing-library/react';

export const render = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult => {
  const result = orgRender(ui, {
    wrapper: TestProviders,
    ...options,
  });
  return result;
};
