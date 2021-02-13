import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { timerState } from '../../../state';
import { MAX_SECONDS } from '../../../utils/constants';

const Timer = (props: TimerProps): React.ReactElement => {
  const { timeUp, syncTime, addTime } = props;
  const [time, setTime] = useRecoilState(timerState);
  // useState hook is required here to allow interval to decrement state using functional updates. This doesn't work with Recoil.
  const [timerTime, setTimerTime] = useState(time.startTime);
  const [allowTimeUp, setAllowTimeUp] = useState(false);

  // Sync host's timer with other players
  useEffect(() => {
    if (time.currentTime % 2 === 0) {
      syncTime(time.currentTime);
    }
  }, [time.currentTime]);

  // Timer logic. Update Recoil state as the Timer's local state updates
  useEffect(() => {
    if (timerTime > MAX_SECONDS) {
      setTimerTime(MAX_SECONDS);
    }
    if (timerTime > 0) {
      setAllowTimeUp(true);
      timeUp(false);
    }
    if (timerTime >= 0) {
      setTime({ ...time, currentTime: timerTime });
    }
    if (timerTime === 0 && allowTimeUp) {
      timeUp(true);
    }
  }, [timerTime]);

  // If the host adds time, update the timer
  useEffect(() => {
    setTimerTime(time.startTime);
  }, [time.startTime]);

  // Decrement local timer state
  const tick = () => {
    setTimerTime((prevTime: number) => {
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
          <span className="time">{time.currentTime}</span>{' '}
          <span className="text">secs</span>
        </div>
      </div>
      {addTime && (
        <button
          className="start-btn center"
          onClick={() => addTime(time.currentTime, 20)}
        >
          + 20 secs
        </button>
      )}
    </>
  );
};

export default Timer;

interface TimerProps {
  seconds: number | undefined;
  timeUp: (bool: boolean) => void;
  syncTime: (seconds: number) => void;
  addTime?: (currentTime: number, add: number) => void;
}
