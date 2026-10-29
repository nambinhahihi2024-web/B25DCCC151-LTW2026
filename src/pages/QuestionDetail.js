import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LEVELS, LETTERS } from '../data';

const QuestionDetail = ({ questions }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const questionId = Number(id);
  const question = questions.find((q) => q.id === questionId);

  if (!question) {
    return (
      <div className="question-detail-page">
        <h2>Không tìm thấy câu hỏi</h2>
        <button onClick={() => navigate(-1)}>Quay lại</button>
      </div>
    );
  }

  return (
    <div className="question-detail-page">
      <h2>
        Câu hỏi số {question.id} ({LEVELS[question.level]})
      </h2>
      <p className="detail-question-text">{question.question}</p>

      <div className="detail-answers">
        {question.options.map((option, idx) => {
          const isCorrect = idx === question.answer;
          return (
            <div
              key={idx}
              className={`detail-answer-item ${isCorrect ? 'correct' : ''}`}
            >
              <strong>{LETTERS[idx]}. </strong>
              {option}
              {isCorrect && <span> (Đáp án đúng)</span>}
            </div>
          );
        })}
      </div>

      <button onClick={() => navigate(-1)} className="back-btn">
        Quay lại
      </button>
    </div>
  );
};

export default QuestionDetail;