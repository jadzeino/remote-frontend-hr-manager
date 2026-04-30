import type { Meta, StoryObj } from '@storybook/react-vite';
import styled from 'styled-components';
import { Text } from './text';

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const meta: Meta<typeof Text> = {
  title: 'ui-kit/Text',
  component: Text,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const AllVariants: Story = {
  render: () => (
    <Stack>
      <Text $variant="h1">h1 — Heading one (30px/500)</Text>
      <Text $variant="h2">h2 — Heading two (24px/500)</Text>
      <Text $variant="h3">h3 — Heading three (24px/500)</Text>
      <Text $variant="h4">h4 — Heading four (22px/500)</Text>
      <Text $variant="bodyLead">bodyLead — Lead paragraph (18px/400)</Text>
      <Text $variant="body">body — Default body (16px/400)</Text>
      <Text $variant="bodyM">bodyM — Medium body (16px/500)</Text>
      <Text $variant="bodyB">bodyB — Bold body (16px/600)</Text>
      <Text $variant="bodySM">bodySM — Small body (14px/400)</Text>
      <Text $variant="bodySMB">bodySMB — Small bold (14px/600)</Text>
      <Text $variant="bodySMXS">bodySMXS — Extra-small (13px/400)</Text>
      <Text $variant="bodyXS">bodyXS — XS body (12px/400)</Text>
    </Stack>
  ),
};

export const WithColor: Story = {
  render: () => (
    <Stack>
      <Text $variant="body" $color="gray-900">gray-900 — Default text</Text>
      <Text $variant="body" $color="gray-600">gray-600 — Secondary text</Text>
      <Text $variant="body" $color="gray-400">gray-400 — Placeholder</Text>
      <Text $variant="body" $color="brand">brand — Brand color</Text>
    </Stack>
  ),
};
