import type { Preview, Decorator } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../src/theme/provider';
import '../src/theme/fonts/styles.css';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const withProviders: Decorator = (Story) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

const preview: Preview = {
  decorators: [withProviders],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#F3F4F8' },
        { name: 'white', value: '#ffffff' },
      ],
    },
  },
};

export default preview;
