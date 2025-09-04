// src/components/Timer.js
import React from 'react';

const Timer = ({ timeLeft }) => {
  // Calculate color based on time left
  const getTimerColor = () => {
    if (timeLeft > 20) return 'green';
    if (timeLeft > 10) return 'orange';
    return 'red';
  };

  return (
    <div className={`timer timer-${getTimerColor()}`}>
      <svg viewBox="0 0 36 36" className="timer-svg">
        <path
          className="timer-bg"
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#eee"
          strokeWidth="3"
        />
        <path
          className="timer-progress"
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke={getTimerColor() === 'green' ? '#4caf50' : getTimerColor() === 'orange' ? '#ff9800' : '#f44336'}
          strokeWidth="3"
          strokeDasharray={`${(timeLeft / 30) * 100}, 100`}
        />
      </svg>
      <div className="timer-text">{timeLeft}s</div>
    </div>
  );
};

export default Timer;