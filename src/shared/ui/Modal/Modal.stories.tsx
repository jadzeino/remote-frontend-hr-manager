import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '@/ui-kit/button';
import { Modal } from './Modal';

const meta: Meta<typeof Modal> = {
  title: 'shared/ui/Modal',
  component: Modal,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Open: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open modal</Button>
        <Modal isOpen={open} onClose={() => setOpen(false)} title="Confirm action">
          <p>Are you sure you want to proceed?</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
            <Button onClick={() => setOpen(false)}>Confirm</Button>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </Modal>
      </>
    );
  },
};

export const Closed: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open modal</Button>
        <Modal isOpen={open} onClose={() => setOpen(false)} title="Confirm action">
          <p>Modal content here.</p>
        </Modal>
      </>
    );
  },
};

export const WithForm: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open modal</Button>
        <Modal isOpen={open} onClose={() => setOpen(false)} title="Add member">
          <form style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <input placeholder="Full name" style={{ height: 40, padding: '0 12px', border: '1px solid #cdd6df', borderRadius: 8 }} />
            <input placeholder="Job title" style={{ height: 40, padding: '0 12px', border: '1px solid #cdd6df', borderRadius: 8 }} />
            <Button type="button" onClick={() => setOpen(false)}>Save</Button>
          </form>
        </Modal>
      </>
    );
  },
};
