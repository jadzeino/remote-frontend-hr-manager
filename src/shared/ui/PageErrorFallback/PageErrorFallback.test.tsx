import { render, screen } from '@/test/utils';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { ErrorBoundary } from 'react-error-boundary';
import { PageErrorFallback } from './PageErrorFallback';

// ─── Unit tests (render the component directly) ──────────────────────────────

describe('PageErrorFallback', () => {
  it('renders default title and message', () => {
    render(<PageErrorFallback />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('An unexpected error occurred. Try refreshing the page.')).toBeInTheDocument();
  });

  it('accepts custom title and message', () => {
    render(
      <PageErrorFallback
        title="Failed to load data"
        message="The server is unavailable."
      />
    );

    expect(screen.getByText('Failed to load data')).toBeInTheDocument();
    expect(screen.getByText('The server is unavailable.')).toBeInTheDocument();
  });

  it('renders Try again button when resetErrorBoundary is provided', () => {
    const onReset = vi.fn();
    render(<PageErrorFallback resetErrorBoundary={onReset} />);

    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('calls resetErrorBoundary when Try again is clicked', async () => {
    const onReset = vi.fn();
    render(<PageErrorFallback resetErrorBoundary={onReset} />);

    await userEvent.click(screen.getByRole('button', { name: /try again/i }));

    expect(onReset).toHaveBeenCalledOnce();
  });

  it('does not render Try again button when resetErrorBoundary is absent', () => {
    render(<PageErrorFallback />);

    expect(screen.queryByRole('button', { name: /try again/i })).not.toBeInTheDocument();
  });

  it('has role=alert for screen readers', () => {
    render(<PageErrorFallback />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('shows error message in non-production env when error is an Error instance', () => {
    render(<PageErrorFallback error={new Error('Network timeout')} />);

    expect(screen.getByTestId('error-detail')).toHaveTextContent('Network timeout');
  });

  it('does not show error detail when error is not an Error instance', () => {
    render(<PageErrorFallback error="something bad" />);

    expect(screen.queryByTestId('error-detail')).not.toBeInTheDocument();
  });
});

// ─── Integration tests (mounted via ErrorBoundary) ───────────────────────────

// Module-level flag: still readable by Bomb after ErrorBoundary resets and
// re-renders it (children are unmounted while boundary is in error state, so
// React state / refs inside them can't be used to toggle the throw).
let bombShouldThrow = true;

const Bomb = () => {
  if (bombShouldThrow) throw new Error('Boom from Bomb');
  return <div>Content loaded fine</div>;
};

describe('PageErrorFallback inside ErrorBoundary', () => {
  beforeEach(() => { bombShouldThrow = true; });

  it('renders children normally when no error is thrown', () => {
    bombShouldThrow = false;
    render(
      <ErrorBoundary FallbackComponent={PageErrorFallback}>
        <Bomb />
      </ErrorBoundary>
    );

    expect(screen.getByText('Content loaded fine')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders fallback when a child throws', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary FallbackComponent={PageErrorFallback}>
        <Bomb />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByTestId('error-detail')).toHaveTextContent('Boom from Bomb');
    expect(screen.queryByText('Content loaded fine')).not.toBeInTheDocument();

    spy.mockRestore();
  });

  it('recovers after clicking Try again once the error condition is cleared', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary FallbackComponent={PageErrorFallback}>
        <Bomb />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();

    // Clear the throw flag before reset so Bomb renders normally on retry
    bombShouldThrow = false;
    await userEvent.click(screen.getByRole('button', { name: /try again/i }));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText('Content loaded fine')).toBeInTheDocument();

    spy.mockRestore();
  });
});
