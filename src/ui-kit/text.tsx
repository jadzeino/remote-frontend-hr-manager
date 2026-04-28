import styled, { DefaultTheme, css } from 'styled-components';

type Props = {
  $variant?: keyof DefaultTheme['typography'];
  /**
   * @todo: This should have stricter typing, similar to "variant". See
   * "theme/color" to learn more.
   */
  $color?: string;
};

export const Text = styled.span<Props>`
  ${(props) => {
    return props.theme.typography[props.$variant ?? 'body'];
  }}

  ${(props) => {
    return (
      props.$color &&
      css`
        color: var(--colors-${props.$color});
      `
    );
  }}
`;
