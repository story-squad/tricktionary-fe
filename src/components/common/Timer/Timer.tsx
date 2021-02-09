import React, { useEffect, useState } from 'react';

const Timer = (props: TimerProps): React.ReactElement => {
  const { seconds, timeUp } = props;
  const [timer, setTimer] = useState(seconds);

  useEffect(() => {
    if (Number(seconds) > 0) {
      let time = Number(seconds);
      const interval = setInterval(() => {
        if (time > 0) {
          time--;
          setTimer(time);
        } else {
          timeUp(true);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <>
      {seconds !== undefined && Number(seconds) > 0 && (
        <div className="countdown-container">
          <div id="timer">
            <span className="time">{timer}</span>{' '}
            <span className="text">secs</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Timer;

interface TimerProps {
  seconds: number | undefined;
  timeUp: (bool: boolean) => void;
}
