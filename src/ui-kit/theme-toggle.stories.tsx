import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeToggle } from './theme-toggle';

const meta: Meta<typeof ThemeToggle> = {
  title: 'ui-kit/ThemeToggle',
  component: ThemeToggle,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const Default: Story = {};
