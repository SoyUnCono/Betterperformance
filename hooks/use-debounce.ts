import { useEffect, useState } from "react";

export const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debounce, setDebounce] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounce(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debounce;
};
