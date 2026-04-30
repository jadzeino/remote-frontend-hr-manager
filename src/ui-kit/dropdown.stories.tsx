import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dropdown } from './dropdown';

const meta: Meta<typeof Dropdown> = {
  title: 'ui-kit/Dropdown',
  component: Dropdown,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

const countryOptions = (
  <>
    <option value="">All countries</option>
    <option value="US">United States</option>
    <option value="GB">United Kingdom</option>
    <option value="DE">Germany</option>
  </>
);

export const Default: Story = {
  args: { value: '', onChange: () => {} },
  render: (args) => <Dropdown {...args}>{countryOptions}</Dropdown>,
};

export const WithValue: Story = {
  args: { value: 'US', onChange: () => {} },
  render: (args) => <Dropdown {...args}>{countryOptions}</Dropdown>,
};

export const Disabled: Story = {
  args: { value: '', disabled: true, onChange: () => {} },
  render: (args) => <Dropdown {...args}>{countryOptions}</Dropdown>,
};
