import React, { useEffect, useState } from 'react';

const Timer = (props: TimerProps): React.ReactElement => {
  const { seconds, timeUp } = props;
  const [time, setTime] = useState(seconds);

  useEffect(() => {
    const interval = setInterval(() => {
      tick(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const tick = (interval: ReturnType<typeof setInterval>) => {
    if (time && time > 0) {
      setTime(time - 1);
    } else if (time) {
      timeUp(true);
      clearInterval(interval);
    } else {
      clearInterval(interval);
    }
  };

  return (
    <div className="timer">
      <p>{time} seconds</p>
    </div>
  );
};

export default Timer;

interface TimerProps {
  seconds: number | undefined;
  timeUp: (bool: boolean) => void;
}
