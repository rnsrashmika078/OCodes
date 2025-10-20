tsx
import React from 'react';

interface Props {
  countdown: number;
}

const SampleReactComponent: React.FC<Props> = ({ countdown }) => {
  const [time, setTime] = React.useState(countdown);
  const [isRunning, setIsRunning] = React.useState(false);

  
    setIsRunning(true);
    setInterval(() => {
      if (time > 0) {
        setTime(time - 1);
      } else {
        setIsRunning(false);
      }
    }, 1000);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  return (
    <div>
      <button onClick={handleStart}>{isRunning ? 'Stop' : 'Start'}</button>
      <p>Time left: {time}</p>
    </div>
  );
};


