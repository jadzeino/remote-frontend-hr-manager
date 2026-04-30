import type { Meta, StoryObj } from '@storybook/react-vite';
import styled from 'styled-components';
import { DisclosurePanel } from './disclosure-panel';

const Anchor = styled.div`
  position: relative;
  display: inline-block;
`;

const meta: Meta<typeof DisclosurePanel> = {
  title: 'ui-kit/DisclosurePanel',
  component: DisclosurePanel,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <Anchor>
        <Story />
      </Anchor>
    ),
  ],
  argTypes: {
    open: { control: 'boolean' },
    align: { control: { type: 'radio' }, options: ['left', 'right'] },
  },
};

export default meta;
type Story = StoryObj<typeof DisclosurePanel>;

export const Open: Story = {
  args: {
    open: true,
    align: 'left',
    minWidth: '200px',
    children: (
      <ul style={{ margin: 0, padding: '8px 0', listStyle: 'none' }}>
        <li style={{ padding: '8px 14px' }}>Option one</li>
        <li style={{ padding: '8px 14px' }}>Option two</li>
        <li style={{ padding: '8px 14px' }}>Option three</li>
      </ul>
    ),
  },
};

export const Closed: Story = {
  args: { ...Open.args, open: false },
};

export const AlignRight: Story = {
  args: { ...Open.args, align: 'right' },
};
