import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatMoney } from '../data';

const Home = ({ playerName, setPlayerName, history }) => {
  const navigate = useNavigate();

  // Tìm kỷ lục điểm cao nhất[cite: 15]
  const topRecord = history.length > 0
    ? [...history].sort((a, b) => b.prize - a.prize)[0]
    : null;

  const handleStart = (e) => {
    e.preventDefault();
    if (playerName.trim()) {
      navigate('/play');
    }
  };

  return (
    <div className="home-page">
      <h2>Ai là triệu phú</h2>

      {topRecord && (
        <div className="top-record">
          <strong>Kỷ lục: {formatMoney(topRecord.prize)} – {topRecord.name}</strong>
        </div>
      )}

      <div className="rules">
        <h3>Luật chơi:</h3>
        <ul>
          <li>Có 15 câu hỏi trắc nghiệm kiến thức Lập trình Web.</li>
          <li>Mỗi câu hỏi có 30 giây để chọn đáp án.</li>
          <li>Các mốc an toàn: Câu 5, Câu 10, Câu 15.</li>
          <li>3 quyền trợ giúp: 50:50, Hỏi khán giả, Dừng cuộc chơi.</li>
        </ul>
      </div>

      <form onSubmit={handleStart} className="start-form">
        <input
          type="text"
          placeholder="Nhập tên người chơi..."
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <button type="submit" disabled={!playerName.trim()}>
          Bắt đầu
        </button>
      </form>
    </div>
  );
};

export default Home;