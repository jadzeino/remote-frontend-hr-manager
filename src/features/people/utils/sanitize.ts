const UNSAFE_CHARS = /[<>'"`;\n\r]/g;
const DEFAULT_MAX_LENGTH = 200;

export function sanitizeInput(value: string, maxLength = DEFAULT_MAX_LENGTH): string {
  return value.trim().replace(UNSAFE_CHARS, '').slice(0, maxLength);
}
