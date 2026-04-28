import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svgr(), react()],
  resolve: { alias: { '@': '/src' } },
  // https://vitest.dev/config/
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup',
    exclude: ['**/node_modules/**', '**/e2e/**'],
  },
});
