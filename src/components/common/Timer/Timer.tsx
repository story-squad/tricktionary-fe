import React, { useEffect, useState } from 'react';

const Timer = (props: TimerProps): React.ReactElement => {
  const { seconds, timeUp } = props;
  const [timer, setTimer] = useState(seconds);

  useEffect(() => {
    if (seconds) {
      let time = seconds;
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
      {seconds && seconds > 0 && (
        <div id="timer">
          <p>
            <span className="time">{timer}</span>{' '}
            <span className="text">seconds left</span>
          </p>
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
