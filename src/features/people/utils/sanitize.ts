const UNSAFE_CHARS = /[<>'"`;]/g;
const MAX_LENGTH = 100;

export function sanitizeInput(value: string): string {
  return value.trim().replace(UNSAFE_CHARS, '').slice(0, MAX_LENGTH);
}
