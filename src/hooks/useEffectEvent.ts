import { useCallback, useLayoutEffect, useRef } from 'react';

/**
 * Ref-based stand-in for React's `useEffectEvent` (React 19.2+; this app is on
 * React 17).
 *
 * Returns a function with a stable identity that always runs the latest `fn`.
 * An Effect calls it to read the newest props and state without listing them
 * as dependencies, so the Effect still fires only on its real trigger (mount,
 * a lobby update, the timer reaching zero).
 *
 * eslint-plugin-react-hooks recognizes the name: it leaves these functions out
 * of dependency lists and reports any call made outside an Effect. Only call
 * the returned function from inside an Effect. After moving to React 19.2+,
 * import `useEffectEvent` from 'react' instead and delete this file.
 */
export function useEffectEvent<Args extends unknown[], Result>(
  fn: (...args: Args) => Result,
): (...args: Args) => Result {
  const latest = useRef(fn);
  // Layout effects run before every passive Effect of the same commit, so an
  // Effect always sees the function from the render it belongs to.
  useLayoutEffect(() => {
    latest.current = fn;
  });
  return useCallback((...args: Args) => latest.current(...args), []);
}
