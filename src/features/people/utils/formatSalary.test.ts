import { describe, it, expect } from 'vitest';
import { formatSalary } from './formatSalary';

describe('formatSalary', () => {
  it('converts cents to dollars', () => {
    expect(formatSalary(6000000, 'USD')).toContain('60,000');
  });

  it('formats EUR currency', () => {
    expect(formatSalary(10000000, 'EUR')).toContain('100,000');
  });

  it('handles zero', () => {
    expect(formatSalary(0, 'USD')).toContain('0');
  });
});
