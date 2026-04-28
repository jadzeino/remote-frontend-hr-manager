import { ThemeProvider } from '@/theme/provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactElement, ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';

function makeTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
    },
  });
}

// https://testing-library.com/docs/react-testing-library/setup#custom-render
export const TestProviders = (props: { children: ReactNode }): ReactElement => {
  const { children } = props;
  const queryClient = makeTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>{children}</ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};
