import React, { useEffect, useState } from 'react';
import { MAX_SECONDS, TIMER_SYNC_INTERVAL } from '../../../utils/constants';

const Timer = (props: TimerProps): React.ReactElement => {
  const { time, setTime, timeUp, syncTime, addTime } = props;
  const [allowTimeUp, setAllowTimeUp] = useState(false);

  // Timer logic. Update Recoil state as the Timer's local state updates
  useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once per tick; the callbacks come from the parent and are not memoized
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
