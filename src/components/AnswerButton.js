import React from 'react';
import { LETTERS } from '../data';

const AnswerButton = ({ index, option, status, selectedAnswer, correctAnswer, isHidden, onClick }) => {
  if (isHidden) {
    return <button className="answer-btn hidden" disabled />;
  }

  let className = 'answer-btn';

  if (status === 'locked' && selectedAnswer === index) {
    className += ' locked'; // Màu cam
  } else if (status === 'revealed') {
    if (index === correctAnswer) {
      className += ' correct'; // Màu xanh
    } else if (selectedAnswer === index) {
      className += ' wrong'; // Màu đỏ
    }
  }

  return (
    <button
      className={className}
      onClick={() => onClick(index)}
      disabled={status !== 'answering'}
    >
      <strong>{LETTERS[index]}. </strong>{option}
    </button>
  );
};

export default AnswerButton;