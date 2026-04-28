import { render, screen, userEvent } from '@/test/utils';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './button';

describe('Button', () => {
  it('renders an accessible button', () => {
    render(<Button>Hello</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveTextContent('Hello');
  });

  it('spreads custom attributes', async () => {
    const onClick = vi.fn();
    render(
      <Button data-foo="12" onClick={onClick}>
        Hello
      </Button>
    );

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(button).toHaveAttribute('data-foo', '12');
    expect(onClick).toHaveBeenCalledOnce();
  });
});
