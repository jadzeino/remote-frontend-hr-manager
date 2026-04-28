import { describe, it, expect } from 'vitest';
import { sanitizeInput } from './sanitize';

describe('sanitizeInput', () => {
  it('trims whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello');
  });

  it('strips unsafe characters', () => {
    expect(sanitizeInput('<script>alert(1)</script>')).toBe('scriptalert(1)/script');
  });

  it('enforces max length of 100', () => {
    expect(sanitizeInput('a'.repeat(200))).toHaveLength(100);
  });

  it('allows normal search terms', () => {
    expect(sanitizeInput('john doe')).toBe('john doe');
  });
});
