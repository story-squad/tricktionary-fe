import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { timerState } from '../../../state';

const Timer = (props: TimerProps): React.ReactElement => {
  const { timeUp, syncTime, addTime } = props;
  const [time, setTime] = useRecoilState(timerState);
  const [timerTime, setTimerTime] = useState(time.startTime);

  useEffect(() => {
    if (time.currentTime % 2 === 0) {
      syncTime(time.currentTime);
    }
  }, [time.currentTime]);

  useEffect(() => {
    if (timerTime >= 0) {
      setTime({ ...time, currentTime: timerTime });
    }
    if (timerTime === 0) {
      timeUp(true);
    }
  }, [timerTime]);

  useEffect(() => {
    setTimerTime(time.startTime);
  }, [time.startTime]);

  const tick = () => {
    setTimerTime((prevTime: number) => prevTime - 1);
  };

  useEffect(() => {
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
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
        <button onClick={() => addTime(time.currentTime, 20)}>+ 20 secs</button>
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
