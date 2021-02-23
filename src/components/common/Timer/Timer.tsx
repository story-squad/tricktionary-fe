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
  }, [time]);

  // Decrement local timer state
  const tick = () => {
    setTime((prevTime: number) => {
      if (prevTime > 0) {
        return prevTime - 1;
      } else {
        return prevTime;
      }
    });
  };

  useEffect(() => {
    const interval = setInterval(tick, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <div className="countdown-container">
        <div id="timer">
          <span className="time">{time}</span>{' '}
          <span className="text">secs</span>
        </div>
        {addTime && (
          <button
            className="start-btn center"
            onClick={() => addTime(time, 20)}
          >
            + 20 secs
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
