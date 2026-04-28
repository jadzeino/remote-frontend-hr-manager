// Source: generate-members.js — same list used to seed the mock data.
// Hardcoding avoids a separate 500-item API call on page load.
export const COUNTRIES = [
  'Argentina', 'Australia', 'Austria', 'Belgium', 'Brazil', 'Canada',
  'Chile', 'China', 'Czech Republic', 'Denmark', 'Finland', 'France',
  'Germany', 'Greece', 'India', 'Ireland', 'Italy', 'Japan', 'Mexico',
  'Netherlands', 'New Zealand', 'Norway', 'Poland', 'Portugal', 'Romania',
  'Singapore', 'South Africa', 'South Korea', 'Spain', 'Sweden',
  'Switzerland', 'UAE', 'United Kingdom', 'United States',
];

export const DEFAULT_LIMIT = 10;

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
};
