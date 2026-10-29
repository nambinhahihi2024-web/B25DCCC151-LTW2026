import React from 'react';
import { PRIZES, MILESTONES, formatMoney } from '../data';

const MoneyLadder = ({ currentQuestionIndex }) => {
  return (
    <div className="money-ladder">
      <h3>Thang tiền thưởng</h3>
      <ul>
        {[...PRIZES].reverse().map((prize, idx) => {
          const questionNumber = 15 - idx;
          const isCurrent = currentQuestionIndex === questionNumber - 1;
          const isMilestone = MILESTONES.includes(questionNumber);

          let className = '';
          if (isCurrent) className += ' active';
          if (isMilestone) className += ' milestone';

          return (
            <li key={questionNumber} className={className.trim()}>
              <span>Câu {questionNumber}</span>
              <span>{formatMoney(prize)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MoneyLadder;