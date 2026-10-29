import React from 'react';

const Timer = ({ timeLeft }) => {
  return (
    <div className={`timer ${timeLeft <= 10 ? 'warning' : ''}`}>
      Còn {timeLeft} giây
    </div>
  );
};

export default Timer;