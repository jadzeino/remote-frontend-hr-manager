import { CURRENCY_SYMBOLS } from '../constants';

// The API stores salary in cents (e.g., 9495000 = $94,950)
export function formatSalary(cents: number, currency: string): string {
  const amount = cents / 100;
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
  const formatted = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(amount);
  return `${currency} ${formatted} ${symbol}`;
}
