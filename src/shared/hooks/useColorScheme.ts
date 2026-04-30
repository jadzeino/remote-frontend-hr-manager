import { useEffect, useState } from 'react';

type ColorScheme = 'light' | 'dark';

const STORAGE_KEY = 'color-scheme';
const ATTR = 'data-theme';

function applyScheme(scheme: ColorScheme) {
  document.documentElement.setAttribute(ATTR, scheme);
}

function getInitial(): ColorScheme {
  let stored: string | null = null;
  try { stored = localStorage.getItem(STORAGE_KEY); } catch { /* private mode */ }
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
    try { localStorage.setItem(STORAGE_KEY, scheme); } catch { /* quota exceeded or private mode */ }
  }, [scheme]);

  const toggle = () => setScheme(s => (s === 'light' ? 'dark' : 'light'));

  return { scheme, toggle };
}
