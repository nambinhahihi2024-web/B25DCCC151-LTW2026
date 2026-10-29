import React from 'react';

const Lifelines = ({
  usedLifelines,
  status,
  onUse5050,
  onUseAudience,
  onStopGame
}) => {
  const isAnswering = status === 'answering';

  return (
    <div className="lifelines">
      <button
        onClick={onUse5050}
        disabled={!isAnswering || usedLifelines['5050']}
      >
        50:50
      </button>
      <button
        onClick={onUseAudience}
        disabled={!isAnswering || usedLifelines['audience']}
      >
        Hỏi khán giả
      </button>
      <button
        onClick={onStopGame}
        disabled={!isAnswering}
      >
        Dừng cuộc chơi
      </button>
    </div>
  );
};

export default Lifelines;