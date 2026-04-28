import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Shared/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['active', 'onboarding', 'offboarded'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Active: Story = {
  args: { status: 'active' },
};

export const Onboarding: Story = {
  args: { status: 'onboarding' },
};

export const Offboarded: Story = {
  args: { status: 'offboarded' },
};

export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Badge status="active" />
      <Badge status="onboarding" />
      <Badge status="offboarded" />
    </div>
  ),
};
