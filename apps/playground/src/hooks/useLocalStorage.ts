import { useEffect, useState } from "react";

export function useLocalStorageString(
  key: string,
  initialValue: string
): [string, (value: string) => void] {
  const [storedValue, setStoredValue] = useState<string>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ?? initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, storedValue);
    } catch {
      // Ignore errors
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
