import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TestProviders } from '@/test/provider';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders active status', () => {
    render(<TestProviders><Badge status="active" /></TestProviders>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders onboarding status', () => {
    render(<TestProviders><Badge status="onboarding" /></TestProviders>);
    expect(screen.getByText('Onboarding')).toBeInTheDocument();
  });

  it('renders offboarded status', () => {
    render(<TestProviders><Badge status="offboarded" /></TestProviders>);
    expect(screen.getByText('Offboarded')).toBeInTheDocument();
  });

  it('has accessible aria-label', () => {
    render(<TestProviders><Badge status="active" /></TestProviders>);
    expect(screen.getByLabelText('Status: Active')).toBeInTheDocument();
  });
});
