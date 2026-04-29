import { useEffect, useState } from 'react';

type ColorScheme = 'light' | 'dark';

const STORAGE_KEY = 'color-scheme';
const ATTR = 'data-theme';

function applyScheme(scheme: ColorScheme) {
  document.documentElement.setAttribute(ATTR, scheme);
}

function getInitial(): ColorScheme {
  const stored = localStorage.getItem(STORAGE_KEY) as ColorScheme | null;
  const resolved =
    stored === 'light' || stored === 'dark'
      ? stored
      : window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
  // Set synchronously before first paint to avoid flash
  applyScheme(resolved);
  return resolved;
}

export function useColorScheme() {
  const [scheme, setScheme] = useState<ColorScheme>(getInitial);

  useEffect(() => {
    applyScheme(scheme);
    localStorage.setItem(STORAGE_KEY, scheme);
  }, [scheme]);

  const toggle = () => setScheme(s => (s === 'light' ? 'dark' : 'light'));

  return { scheme, toggle };
}
