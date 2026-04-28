import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from './app/app';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const container = document.getElementById('root');
if (container === null) throw Error('Missing "root" element');

ReactDOM.createRoot(container).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
