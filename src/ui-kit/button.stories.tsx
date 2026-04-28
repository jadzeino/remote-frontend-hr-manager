import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'UI Kit/Button',
  component: Button,
  tags: ['autodocs'],
  args: { onClick: () => {} },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: { children: 'Button' },
};

export const Loading: Story = {
  args: { children: 'Saving...', $isLoading: true },
};

export const Disabled: Story = {
  args: { children: 'Disabled', disabled: true },
};

export const AddMember: Story = {
  args: { children: '+ Add member' },
};
