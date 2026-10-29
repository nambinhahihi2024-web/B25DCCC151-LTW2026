import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LEVELS } from '../data';

const QuestionBank = ({ questions }) => {
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredQuestions = questions.filter((q) => {
    const matchLevel =
      selectedLevel === 'all' || q.level === Number(selectedLevel);
    const matchSearch = q.question
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchLevel && matchSearch;
  });

  return (
    <div className="question-bank-page">
      <h2>Ngân hàng câu hỏi</h2>

      <div className="filters">
        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
        >
          <option value="all">Tất cả mức độ</option>
          <option value="1">Dễ</option>
          <option value="2">Trung bình</option>
          <option value="3">Khó</option>
        </select>

        <input
          type="text"
          placeholder="Tìm kiếm câu hỏi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <p>Có {filteredQuestions.length} câu hỏi</p>

      <table className="questions-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Mức độ</th>
            <th>Câu hỏi</th>
          </tr>
        </thead>
        <tbody>
          {filteredQuestions.map((q, idx) => (
            <tr key={q.id}>
              <td>{idx + 1}</td>
              <td>{LEVELS[q.level]}</td>
              <td>
                <Link to={`/questions/${q.id}`}>{q.question}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionBank;