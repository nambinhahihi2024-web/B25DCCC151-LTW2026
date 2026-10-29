import React from 'react';
import AnswerButton from './AnswerButton';

const QuestionCard = ({
  questionIndex,
  questionData,
  status,
  selectedAnswer,
  hiddenAnswers,
  onSelectAnswer
}) => {
  if (!questionData) return null;

  return (
    <div className="question-card">
      <h3>Câu {questionIndex + 1}/15</h3>
      <p className="question-text">{questionData.question}</p>
      <div className="answers-grid">
        {questionData.options.map((option, idx) => (
          <AnswerButton
            key={idx}
            index={idx}
            option={option}
            status={status}
            selectedAnswer={selectedAnswer}
            correctAnswer={questionData.answer}
            isHidden={hiddenAnswers.includes(idx)}
            onClick={onSelectAnswer}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;