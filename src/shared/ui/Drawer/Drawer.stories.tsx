import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '@/ui-kit/button';
import { Drawer, DrawerBody } from './Drawer';

const meta: Meta<typeof Drawer> = {
  title: 'shared/ui/Drawer',
  component: Drawer,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Open: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open drawer</Button>
        <Drawer isOpen={open} onClose={() => setOpen(false)} title="Member details">
          <DrawerBody>
            <p>Drawer content goes here.</p>
          </DrawerBody>
        </Drawer>
      </>
    );
  },
};

export const Closed: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open drawer</Button>
        <Drawer isOpen={open} onClose={() => setOpen(false)} title="Member details">
          <DrawerBody>
            <p>Drawer content goes here.</p>
          </DrawerBody>
        </Drawer>
      </>
    );
  },
};

export const LongContent: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open drawer</Button>
        <Drawer isOpen={open} onClose={() => setOpen(false)} title="Scrollable content">
          <DrawerBody>
            {Array.from({ length: 20 }).map((_, i) => (
              <p key={i} style={{ marginBottom: 16 }}>
                Row {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            ))}
          </DrawerBody>
        </Drawer>
      </>
    );
  },
};
