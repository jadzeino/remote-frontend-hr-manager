import { describe, it, expect } from 'vitest';
import { sanitizeInput } from './sanitize';

describe('sanitizeInput', () => {
  it('trims whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello');
  });

  it('strips unsafe characters', () => {
    expect(sanitizeInput('<script>alert(1)</script>')).toBe('scriptalert(1)/script');
  });

  it('enforces default max length of 200', () => {
    expect(sanitizeInput('a'.repeat(300))).toHaveLength(200);
  });

  it('respects a custom maxLength', () => {
    expect(sanitizeInput('a'.repeat(50), 30)).toHaveLength(30);
  });

  it('allows normal search terms', () => {
    expect(sanitizeInput('john doe')).toBe('john doe');
  });

  it('strips newlines to prevent CSV multi-line injection', () => {
    expect(sanitizeInput('line1\nline2')).toBe('line1line2');
    expect(sanitizeInput('line1\rline2')).toBe('line1line2');
  });
});
