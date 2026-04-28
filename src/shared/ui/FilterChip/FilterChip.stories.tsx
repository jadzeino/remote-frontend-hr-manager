import type { Meta, StoryObj } from '@storybook/react-vite';
import { FilterChip } from './FilterChip';

const meta: Meta<typeof FilterChip> = {
  title: 'Shared/FilterChip',
  component: FilterChip,
  tags: ['autodocs'],
  args: { onRemove: () => {} },
};

export default meta;
type Story = StoryObj<typeof FilterChip>;

export const Default: Story = {
  args: { label: 'Active' },
};

export const LongLabel: Story = {
  args: { label: 'United States of America' },
};

export const MultipleChips: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <FilterChip label="Active" onRemove={() => {}} />
      <FilterChip label="Germany" onRemove={() => {}} />
      <FilterChip label="Employee" onRemove={() => {}} />
      <FilterChip label='"john"' onRemove={() => {}} />
    </div>
  ),
};
