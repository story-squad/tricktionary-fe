import { useCallback, useRef, useState } from 'react';
// Hook translated to TS from JS https://usehooks.com/useLocalStorage/
// T defaults to any: TypeScript 4.8+ no longer infers it from the caller's
// destructuring pattern, which is what made the untyped call sites `any` before.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useLocalStorage<T = any>(
  key: string,
  initialValue: unknown,
): Array<T> {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      if (item && typeof JSON.parse(item) === 'number') {
        return String(JSON.parse(item));
      }
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log('uselocalstorage error', error);
      return initialValue;
    }
  });
  // The value from the latest render, so the setter and reload functions below
  // can keep one identity for the life of the component (like useState's
  // setter) and still be listed as Effect dependencies without re-running them.
  const latestValue = useRef(storedValue);
  latestValue.current = storedValue;

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = useCallback(
    (value: (arg0: unknown) => unknown) => {
      try {
        let sv;
        // Allow value to be a function so we have same API as useState
        if (value instanceof Function) {
          sv = value(latestValue.current);
        } else {
          sv = value;
        }
        // Save state
        setStoredValue(sv);
        // Save to local storage
        window.localStorage.setItem(key, JSON.stringify(sv));
      } catch (error) {
        // A more advanced implementation would handle the error case
        console.log(error);
      }
    },
    [key],
  );

  // Reload state from localStorage manually if needed
  const reloadValue = useCallback(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item && typeof JSON.parse(item) === 'number') {
        setStoredValue(String(JSON.parse(item)));
        return String(JSON.parse(item));
      }
      if (item) {
        setStoredValue(JSON.parse(item));
        return JSON.parse(item);
      } else {
        return latestValue.current;
      }
    } catch (error) {
      console.log(error);
      return latestValue.current;
    }
  }, [key]);

  return [storedValue, setValue, reloadValue];
}
