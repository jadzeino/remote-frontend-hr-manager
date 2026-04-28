import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchInput } from './search-input';

const meta: Meta<typeof SearchInput> = {
  title: 'UI Kit/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
  args: { placeholder: 'Search people...' },
};

export const WithValue: Story = {
  args: { placeholder: 'Search people...', value: 'john doe', readOnly: true },
};
