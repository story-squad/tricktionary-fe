import { useState } from 'react';
// Hook translated to TS from JS https://usehooks.com/useLocalStorage/
export function useLocalStorage<T>(
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
      console.log(error);
      return initialValue;
    }
  });
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: (arg0: unknown) => unknown) => {
    try {
      let sv;
      // Allow value to be a function so we have same API as useState
      if (value instanceof Function) {
        sv = value(storedValue);
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
  };

  // Reload state from localStorage manually if needed
  const reloadValue = () => {
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
        return storedValue;
      }
    } catch (error) {
      console.log(error);
      return storedValue;
    }
  };

  return [storedValue, setValue, reloadValue];
}
