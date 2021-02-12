import React, { useEffect, useState } from 'react';

const Timer = (props: TimerProps): React.ReactElement => {
  const { timeUp } = props;
  const seconds = Number(props.seconds);
  const [timer, setTimer] = useState(seconds);

  useEffect(() => {
    if (seconds > 0) {
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
      {seconds !== undefined && seconds > 0 && (
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
