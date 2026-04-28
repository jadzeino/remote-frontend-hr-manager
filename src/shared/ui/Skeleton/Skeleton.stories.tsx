import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Shared/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: { $width: '200px', $height: '16px' },
};

export const Circle: Story = {
  args: { $width: '40px', $height: '40px', $borderRadius: '50%' },
};

export const TableRow: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, padding: 16, background: 'white' }}>
      <Skeleton $width="32px" $height="32px" $borderRadius="50%" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Skeleton $width="180px" $height="14px" />
        <Skeleton $width="120px" $height="12px" />
      </div>
    </div>
  ),
};
