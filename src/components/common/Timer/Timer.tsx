import React, { useEffect, useState } from 'react';

const Timer = (props: TimerProps): React.ReactElement => {
  const { timeUp, syncTime, addTime } = props;
  const seconds = Number(props.seconds);
  const [timer, setTimer] = useState(seconds);

  useEffect(() => {
    if (timer % 5 === 0) {
      console.log(timer);
      syncTime(timer);
    }
  }, [timer]);

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
  }, [seconds]);

  return (
    <>
      {seconds !== undefined && seconds > 0 && (
        <>
          <div className="countdown-container">
            <div id="timer">
              <span className="time">{timer}</span>{' '}
              <span className="text">secs</span>
            </div>
          </div>
          {addTime && (
            <button onClick={() => addTime(timer, 20)}>+ 20 secs</button>
          )}
        </>
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
