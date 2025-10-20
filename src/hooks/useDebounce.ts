import { useEffect, useState } from "react";

export const useDebounce = (inputText: String, delay: number) => {
  const [debouncedText, setDebouncedText] = useState<String>("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedText(inputText);
    }, delay);

    return () => clearTimeout(timeout);
  }, [inputText, delay]);

  return debouncedText;
};
