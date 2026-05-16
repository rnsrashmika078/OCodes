import { useEffect, useState } from "react";

export const useDebounce = (inputText: string, delay: number) => {
  const [debouncedText, setDebouncedText] = useState<string>("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedText(inputText);
    }, delay);

    return () => clearTimeout(timeout);
  }, [inputText, delay]);

  return debouncedText;
};
export const useFocusNode = (
  ref: React.RefObject<HTMLDivElement | null>,
  clickInsideCb?: () => void,
  clickOutsideCb?: () => void,
) => {
  useEffect(() => {
    if (!ref.current) return;
    const focus = (e: MouseEvent) => {
      if (ref.current?.contains(e.target as HTMLElement)) {
        clickInsideCb?.();
      } else {
        clickOutsideCb?.();
      }
    };

    document.addEventListener("mousedown", focus);

    return () => document.removeEventListener("mousedown", focus);
  });
};
