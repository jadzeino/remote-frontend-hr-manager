import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// We don't use global API in vitest,
// so we need to manually bind the cleanup.
// See:
// - https://vitest.dev/config/#globals
// - https://testing-library.com/docs/react-testing-library/api/#cleanup
afterEach(cleanup);
