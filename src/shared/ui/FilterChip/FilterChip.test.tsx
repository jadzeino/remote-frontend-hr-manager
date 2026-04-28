import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TestProviders } from '@/test/provider';
import { FilterChip } from './FilterChip';

describe('FilterChip', () => {
  it('renders the label', () => {
    render(
      <TestProviders>
        <FilterChip label="Active" onRemove={vi.fn()} />
      </TestProviders>
    );
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('calls onRemove when clicked', async () => {
    const onRemove = vi.fn();
    render(
      <TestProviders>
        <FilterChip label="Active" onRemove={onRemove} />
      </TestProviders>
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it('has accessible aria-label', () => {
    render(
      <TestProviders>
        <FilterChip label="Active" onRemove={vi.fn()} />
      </TestProviders>
    );
    expect(screen.getByLabelText('Remove filter: Active')).toBeInTheDocument();
  });
});
