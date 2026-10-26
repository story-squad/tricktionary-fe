import React, { useEffect, useState } from 'react';
import { useEffectEvent } from '../../../hooks';
import { MAX_SECONDS, TIMER_SYNC_INTERVAL } from '../../../utils/constants';

const Timer = (props: TimerProps): React.ReactElement => {
  const { time, setTime, timeUp, syncTime, addTime } = props;
  const [allowTimeUp, setAllowTimeUp] = useState(false);

  // Timer logic for one tick. The callbacks come from the parent and are not
  // memoized, and allowTimeUp changes on the first tick; reading them here keeps
  // them from re-running the tick.
  const onTick = useEffectEvent((time: number) => {
    // Sync host's timer with other players
    if (time % TIMER_SYNC_INTERVAL === 0) {
      syncTime(time);
    }
    if (time > MAX_SECONDS) {
      setTime(MAX_SECONDS);
    }
    if (time > 0) {
      setAllowTimeUp(true);
      timeUp(false);
    }
    if (time === 0 && allowTimeUp) {
      timeUp(true);
    }
  });

  // Run the timer logic once per tick. Update Recoil state as the Timer's local state updates
  useEffect(() => {
    onTick(time);
  }, [time]);

  // Decrement local timer state
  useEffect(() => {
    const tick = () => {
      setTime((prevTime: number) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          return prevTime;
        }
      });
    };
    const interval = setInterval(tick, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [setTime]);

  return (
    <>
      <div className="countdown-container">
        <p>Timer</p>
        <span className="time">{time}</span>{' '}
        {addTime && (
          <button
            className="add-time center auto-width"
            onClick={() => addTime(time, 20)}
          >
            Add 20 seconds
          </button>
        )}
      </div>
    </>
  );
};

export default Timer;

interface TimerProps {
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  timeUp: (bool: boolean) => void;
  syncTime: (seconds: number) => void;
  addTime?: (currentTime: number, add: number) => void;
}
