import { useRef, useCallback } from "react";

export const useDebounce = <T extends (...args: any[]) => void>(
  fn: T,
  delay: number
) => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        fn(...args);
      }, delay);
    },
    [fn, delay]
  );

  return debouncedFn;
};
