import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Checkbox } from './checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'ui-kit/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
  argTypes: {
    disabled: { control: 'boolean' },
    checked: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Unchecked: Story = {
  args: { label: 'Label text', checked: false, onChange: () => {} },
};

export const Checked: Story = {
  args: { label: 'Label text', checked: true, onChange: () => {} },
};

export const Disabled: Story = {
  args: { label: 'Disabled', checked: false, disabled: true, onChange: () => {} },
};

export const DisabledChecked: Story = {
  args: { label: 'Disabled + checked', checked: true, disabled: true, onChange: () => {} },
};

export const Interactive: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <Checkbox
        label={checked ? 'Checked' : 'Unchecked'}
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
    );
  },
};
