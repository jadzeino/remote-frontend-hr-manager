import { CURRENCY_SYMBOLS } from '../constants';

// Locale that matches each currency's regional number format convention:
// EUR → de-DE  →  "42.000"  (period = thousands, comma = decimal)
// USD → en-US  →  "42,000"  (comma = thousands, period = decimal)
// GBP → en-GB  →  "42,000"
const CURRENCY_LOCALES: Record<string, string> = {
  USD: 'en-US',
  GBP: 'en-GB',
  EUR: 'de-DE',
};

// Salary is stored in cents (e.g. 9495000 → 94,950)
export function formatSalary(cents: number, currency: string): string {
  const amount = cents / 100;
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
  const locale = CURRENCY_LOCALES[currency] ?? 'en-US';
  const formatted = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(amount);
  return `${currency} ${formatted} ${symbol}`;
}
