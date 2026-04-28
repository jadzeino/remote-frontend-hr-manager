import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { TestProviders } from '@/test/provider';
import { PeoplePage } from '@/features/people/page';

const mockFetch = vi.fn();
beforeEach(() => {
  global.fetch = mockFetch;
  mockFetch.mockResolvedValue({
    ok: true,
    headers: { get: () => '0' },
    json: async () => [],
  });
});

describe('PeoplePage', () => {
  it("should render 'People' in the page", async () => {
    render(
      <TestProviders>
        <PeoplePage />
      </TestProviders>
    );
    expect(screen.getByTestId('page-title')).toHaveTextContent('People');
  });
});
