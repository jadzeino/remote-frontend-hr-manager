import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconButton } from './icon-button';

const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const meta: Meta<typeof IconButton> = {
  title: 'ui-kit/IconButton',
  component: IconButton,
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: { type: 'radio' }, options: ['sm', 'md'] },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Small: Story = {
  args: { size: 'sm', 'aria-label': 'Previous', children: <ChevronIcon /> },
};

export const Medium: Story = {
  args: { size: 'md', 'aria-label': 'Previous', children: <ChevronIcon /> },
};

export const Disabled: Story = {
  args: { size: 'md', disabled: true, 'aria-label': 'Previous', children: <ChevronIcon /> },
};
