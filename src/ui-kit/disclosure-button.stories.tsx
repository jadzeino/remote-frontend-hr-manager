import type { Meta, StoryObj } from '@storybook/react-vite';
import { DisclosureButton } from './disclosure-button';

const meta: Meta<typeof DisclosureButton> = {
  title: 'ui-kit/DisclosureButton',
  component: DisclosureButton,
  parameters: { layout: 'centered' },
  argTypes: {
    active: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof DisclosureButton>;

export const Default: Story = {
  args: { children: 'All countries' },
};

export const Active: Story = {
  args: { active: true, children: 'Germany' },
};

export const Disabled: Story = {
  args: { disabled: true, children: 'All countries' },
};
