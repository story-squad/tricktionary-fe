import { act, render } from '@testing-library/react';
import React, { useEffect } from 'react';
import { useEffectEvent } from './useEffectEvent';
import { useLocalStorage } from './useLocalStorage';

describe('useEffectEvent', () => {
  it('keeps one identity and calls the function from the latest render', () => {
    const identities = new Set<unknown>();
    const seen: number[] = [];

    const Probe = ({ count }: { count: number }) => {
      const read = useEffectEvent(() => count);
      // Runs on mount only
      useEffect(() => {
        seen.push(read());
      }, []);
      // Runs after every render
      useEffect(() => {
        identities.add(read);
        seen.push(read());
      });
      return null;
    };

    const { rerender } = render(<Probe count={1} />);
    rerender(<Probe count={2} />);
    rerender(<Probe count={3} />);

    expect(identities.size).toBe(1);
    // mount: both effects see 1; each re-render: the every-render effect sees the new value
    expect(seen).toEqual([1, 1, 2, 3]);
  });
});

describe('useLocalStorage', () => {
  beforeEach(() => window.localStorage.clear());

  it('returns setter and reload functions that keep their identity', () => {
    const setters = new Set<unknown>();
    const reloads = new Set<unknown>();
    const Probe = ({ n }: { n: number }) => {
      const [, setValue, reloadValue] = useLocalStorage('k', n);
      setters.add(setValue);
      reloads.add(reloadValue);
      return null;
    };

    const { rerender } = render(<Probe n={1} />);
    rerender(<Probe n={2} />);

    expect(setters.size).toBe(1);
    expect(reloads.size).toBe(1);
  });

  it('passes the current value to an updater and persists the result', () => {
    let api: unknown[] = [];
    const Probe = () => {
      api = useLocalStorage<unknown>('list', [1]);
      return null;
    };
    render(<Probe />);
    const setValue = api[1] as (fn: (prev: unknown) => unknown) => void;
    const append = (n: number) => (prev: unknown) => [...(prev as number[]), n];

    // The same (stable) setter, called after a re-render, sees the new value
    act(() => setValue(append(2)));
    act(() => setValue(append(3)));

    expect(api[0]).toEqual([1, 2, 3]);
    expect(window.localStorage.getItem('list')).toBe('[1,2,3]');
  });

  it('reads plain (not JSON-encoded) strings back with plainString', () => {
    let value: unknown;
    const Probe = ({ k }: { k: string }) => {
      [value] = useLocalStorage(k, 'initial', { plainString: true });
      return null;
    };

    // Saved by an older build with localStorage.setItem
    const saved: Record<string, string> = {
      a: 'Alice',
      b: '1234',
      c: 'null',
      d: 'true',
      e: JSON.stringify('Bob'),
    };
    const read: Record<string, unknown> = {};
    Object.entries(saved).forEach(([k, item]) => {
      window.localStorage.setItem(k, item);
      const { unmount } = render(<Probe k={k} />);
      read[k] = value;
      unmount();
    });

    expect(read).toEqual({
      a: 'Alice',
      b: '1234',
      c: 'null',
      d: 'true',
      e: 'Bob',
    });
  });

  it('falls back to the initial value for a plain string without plainString', () => {
    let value: unknown;
    const Probe = () => {
      [value] = useLocalStorage('k', 'initial');
      return null;
    };
    window.localStorage.setItem('k', 'Alice');
    render(<Probe />);
    expect(value).toBe('initial');
  });

  it('round-trips a string through the setter', () => {
    let api: unknown[] = [];
    const Probe = () => {
      api = useLocalStorage('name', 'initial', { plainString: true });
      return null;
    };
    const { unmount } = render(<Probe />);
    act(() => (api[1] as (v: string) => void)('Alice'));
    expect(window.localStorage.getItem('name')).toBe('"Alice"');
    unmount();

    render(<Probe />);
    expect(api[0]).toBe('Alice');
  });
});
