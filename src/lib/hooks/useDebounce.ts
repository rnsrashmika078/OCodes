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
