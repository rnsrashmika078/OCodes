import { useEffect } from "react";

export const useGlobalKey = (callback: () => void) => {
  useEffect(() => {
    console.log("UseEffect rendering: UseGlobalKey -> Open Or Close Agent UI");
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "p") {
        e.preventDefault();
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [callback]);
};
