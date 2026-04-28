import { describe, it, expect } from 'vitest';
import { formatSalary } from './formatSalary';

describe('formatSalary', () => {
  it('formats USD with comma as thousands separator', () => {
    expect(formatSalary(6000000, 'USD')).toBe('USD 60,000 $');
  });

  it('formats EUR with period as thousands separator (de-DE locale)', () => {
    expect(formatSalary(10000000, 'EUR')).toBe('EUR 100.000 €');
  });

  it('formats GBP with comma as thousands separator', () => {
    expect(formatSalary(5050000, 'GBP')).toBe('GBP 50,500 £');
  });

  it('handles zero', () => {
    expect(formatSalary(0, 'USD')).toBe('USD 0 $');
  });

  it('divides cents correctly for large values', () => {
    // 9,495,000 cents = 94,950 USD
    expect(formatSalary(9495000, 'USD')).toBe('USD 94,950 $');
  });
});
