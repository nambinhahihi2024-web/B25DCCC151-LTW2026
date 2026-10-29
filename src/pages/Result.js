import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { formatMoney } from '../data';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  // Nếu mở thẳng /result không qua state thì về /[cite: 14]
  if (!state) {
    return <Navigate to="/" replace />;
  }

  const { name, prize, correctCount, reason } = state;

  const renderMessage = () => {
    switch (reason) {
      case 'win':
        return 'Chúc mừng! Bạn đã trở thành triệu phú';
      case 'wrong':
        return 'Rất tiếc, bạn đã trả lời sai';
      case 'timeout':
        return 'Hết giờ!';
      case 'stop':
        return 'Bạn đã dừng cuộc chơi';
      default:
        return 'Kết thúc lượt chơi';
    }
  };

  return (
    <div className="result-page">
      <h2>{renderMessage()}</h2>
      <div className="result-details">
        <p><strong>Người chơi:</strong> {name}</p>
        <p><strong>Số câu trả lời đúng:</strong> {correctCount}</p>
        <p><strong>Tiền thưởng:</strong> {formatMoney(prize)}</p>
      </div>
      <div className="result-actions">
        <button onClick={() => navigate('/play')}>Chơi lại</button>
        <button onClick={() => navigate('/')}>Về trang chủ</button>
      </div>
    </div>
  );
};

export default Result;