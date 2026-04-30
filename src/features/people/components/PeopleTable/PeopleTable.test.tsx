import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TestProviders } from '@/test/provider';
import { PeoplePage } from '@/features/people/page';
import { Person } from '../../types';

const makePerson = (overrides: Partial<Person> = {}): Person => ({
  id: 1,
  name: 'Jane Smith',
  jobTitle: 'Engineer',
  country: 'USA',
  salary: 6000000,
  currency: 'USD',
  employment: 'employee',
  status: 'active',
  photo: '',
  ...overrides,
});

function mockFetchResponse(people: Person[], total?: number) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    headers: { get: (h: string) => h === 'X-Total-Count' ? String(total ?? people.length) : null },
    json: async () => people,
  });
}

describe('PeoplePage', () => {
  beforeEach(() => {
    mockFetchResponse([]);
  });

  it('renders page title', async () => {
    render(<TestProviders><PeoplePage /></TestProviders>);
    expect(screen.getByTestId('page-title')).toHaveTextContent('People');
  });

  it('renders search input', () => {
    render(<TestProviders><PeoplePage /></TestProviders>);
    expect(screen.getByLabelText('Search people')).toBeInTheDocument();
  });

  it('shows Add member button', () => {
    render(<TestProviders><PeoplePage /></TestProviders>);
    expect(screen.getByRole('button', { name: /add member/i })).toBeInTheDocument();
  });

  it('renders skeleton rows while loading', () => {
    render(<TestProviders><PeoplePage /></TestProviders>);
    // During loading, aria-busy is true on the table
    const tables = screen.getAllByRole('grid');
    expect(tables.length).toBeGreaterThan(0);
  });

  it('renders people rows after data loads', async () => {
    mockFetchResponse([makePerson({ name: 'Jane Smith' })], 1);
    render(<TestProviders><PeoplePage /></TestProviders>);
    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('shows salary in human-readable format, not raw cents', async () => {
    mockFetchResponse([makePerson({ salary: 6000000, currency: 'USD' })], 1);
    render(<TestProviders><PeoplePage /></TestProviders>);
    await waitFor(() => {
      expect(screen.getByText(/60,000/)).toBeInTheDocument();
    });
  });

  it('shows empty state when no results', async () => {
    mockFetchResponse([], 0);
    render(<TestProviders><PeoplePage /></TestProviders>);
    await waitFor(() => {
      expect(screen.getByText(/No people found/i)).toBeInTheDocument();
    });
  });

  it('status badge renders correctly', async () => {
    mockFetchResponse([makePerson({ status: 'onboarding' })], 1);
    render(<TestProviders><PeoplePage /></TestProviders>);
    await waitFor(() => {
      expect(screen.getByText('Onboarding')).toBeInTheDocument();
    });
  });

  it('opens Add member modal when button is clicked', async () => {
    render(<TestProviders><PeoplePage /></TestProviders>);
    await userEvent.click(screen.getByRole('button', { name: /add member/i }));
    // Modal has aria-labelledby="modal-title" with text "Add member"
    expect(screen.getByRole('dialog', { name: 'Add member' })).toBeInTheDocument();
  });

  it('opens person drawer when row is clicked', async () => {
    mockFetchResponse([makePerson({ name: 'Jane Smith' })], 1);
    render(<TestProviders><PeoplePage /></TestProviders>);
    await waitFor(() => screen.getByText('Jane Smith'));
    await userEvent.click(screen.getByRole('button', { name: /View details for Jane Smith/i }));
    await waitFor(() => {
      expect(screen.getByText('Member details')).toBeInTheDocument();
    });
  });
});
