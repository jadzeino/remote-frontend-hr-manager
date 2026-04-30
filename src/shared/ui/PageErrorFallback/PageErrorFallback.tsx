import styled from 'styled-components';
import { Button } from '@/ui-kit/button';
import { Text } from '@/ui-kit/text';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-4);
  padding: var(--spacing-8) var(--spacing-4);
  min-height: 320px;
  text-align: center;
`;

const IconCircle = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--colors-gray-100);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--colors-gray-500);
`;

type Props = {
  /** Error that was caught (react-error-boundary passes unknown). */
  error?: unknown;
  /** Called when the user clicks "Try again". */
  resetErrorBoundary?: () => void;
  /** Override the default heading. */
  title?: string;
  /** Override the default body message. */
  message?: string;
};

export const PageErrorFallback = ({
  error,
  resetErrorBoundary,
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Try refreshing the page.',
}: Props) => {
  const errorMessage = error instanceof Error ? error.message : undefined;
  return (
  <Wrapper role="alert" aria-live="assertive">
    <IconCircle aria-hidden="true">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    </IconCircle>

    <div>
      <Text as="h2" $variant="bodyM" $color="gray-900" style={{ marginBottom: 6 }}>
        {title}
      </Text>
      <Text $variant="bodySM" $color="gray-500">{message}</Text>
    </div>

    {process.env.NODE_ENV !== 'production' && errorMessage && (
      <Text
        as="pre"
        $variant="bodyXS"
        $color="gray-500"
        style={{ maxWidth: 480, overflowX: 'auto', textAlign: 'left', whiteSpace: 'pre-wrap' }}
        data-testid="error-detail"
      >
        {errorMessage}
      </Text>
    )}

    {resetErrorBoundary && (
      <Button onClick={resetErrorBoundary}>Try again</Button>
    )}
  </Wrapper>
  );
};
