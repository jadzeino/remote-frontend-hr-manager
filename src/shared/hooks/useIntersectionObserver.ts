import { RefObject, useEffect } from 'react';

type Options = {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
};

export function useIntersectionObserver(
  ref: RefObject<Element | null>,
  callback: () => void,
  options: Options = {}
): void {
  const { threshold = 0.1, rootMargin = '0px', enabled = true } = options;

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          callback();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, callback, threshold, rootMargin, enabled]);
}
