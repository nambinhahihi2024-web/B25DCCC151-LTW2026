import React from 'react';
import { formatMoney } from '../data';

const History = ({ history, onClearHistory }) => {
  if (!history || history.length === 0) {
    return <div className="history-page"><p>Chưa có lượt chơi nào.</p></div>;
  }

  // Sắp xếp bản sao giảm dần theo tiền thưởng[cite: 15, 17]
  const sortedHistory = [...history].sort((a, b) => b.prize - a.prize);

  const totalGames = history.length;
  const highestPrize = Math.max(...history.map((item) => item.prize));
  const totalPrize = history.reduce((acc, item) => acc + item.prize, 0);

  return (
    <div className="history-page">
      <h2>Lịch sử các lượt chơi</h2>
      <div className="stats-summary">
        <p>Số lượt chơi: {totalGames}</p>
        <p>Tiền thưởng cao nhất: {formatMoney(highestPrize)}</p>
        <p>Tổng tiền thưởng: {formatMoney(totalPrize)}</p>
      </div>

      <button onClick={onClearHistory} className="clear-btn">
        Xóa lịch sử
      </button>

      <table className="history-table">
        <thead>
          <tr>
            <th>Người chơi</th>
            <th>Số câu đúng</th>
            <th>Tiền thưởng</th>
            <th>Thời gian</th>
          </tr>
        </thead>
        <tbody>
          {sortedHistory.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.correctCount}</td>
              <td>{formatMoney(item.prize)}</td>
              <td>{item.playedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;