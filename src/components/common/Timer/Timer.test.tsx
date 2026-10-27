import { act, render } from '@testing-library/react';
import React, { useState } from 'react';
import { vi } from 'vitest';
import Timer from './Timer';

// The parent passes new (unmemoized) callbacks on every render, as Writing does.
const Harness = (props: {
  start: number;
  timeUp: (done: boolean) => void;
  syncTime: (seconds: number) => void;
  tick?: number;
}) => {
  const [time, setTime] = useState(props.start);
  return (
    <Timer
      time={time}
      setTime={setTime}
      timeUp={(done) => props.timeUp(done)}
      syncTime={(seconds) => props.syncTime(seconds)}
    />
  );
};

// One act per second, so each tick renders (act batches the updates inside it)
const advanceSeconds = (seconds: number) => {
  for (let i = 0; i < seconds; i++) {
    act(() => {
      vi.advanceTimersByTime(1000);
    });
  }
};

describe('Timer', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('signals time up once, at zero, and syncs once per even second', () => {
    const timeUp = vi.fn();
    const syncTime = vi.fn();
    const { rerender } = render(
      <Harness start={5} timeUp={timeUp} syncTime={syncTime} />,
    );

    advanceSeconds(5);

    expect(timeUp.mock.calls.filter(([done]) => done)).toHaveLength(1);
    expect(timeUp).toHaveBeenLastCalledWith(true);
    expect(syncTime.mock.calls.map(([s]) => s)).toEqual([4, 2, 0]);

    // The parent re-renders with new callbacks and the clock stays at zero:
    // nothing fires again.
    const calls = timeUp.mock.calls.length + syncTime.mock.calls.length;
    rerender(
      <Harness start={5} timeUp={timeUp} syncTime={syncTime} tick={1} />,
    );
    advanceSeconds(3);
    expect(timeUp.mock.calls.length + syncTime.mock.calls.length).toBe(calls);
  });

  it('does not signal time up when mounted at zero', () => {
    const timeUp = vi.fn();
    render(<Harness start={0} timeUp={timeUp} syncTime={vi.fn()} />);
    advanceSeconds(2);
    expect(timeUp).not.toHaveBeenCalledWith(true);
  });
});
