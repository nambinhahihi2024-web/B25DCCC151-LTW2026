import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';

import Layout from './components/Layout';
import Home from './pages/Home';
import Play from './pages/Play';
import Result from './pages/Result';
import History from './pages/History';
import QuestionBank from './pages/QuestionBank';
import QuestionDetail from './pages/QuestionDetail';
import NotFound from './pages/NotFound';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [playerName, setPlayerName] = useState('');

  // Lấy lịch sử từ localStorage[cite: 15]
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('ltw_trieuphu_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Tải danh sách câu hỏi bằng axios + AbortController[cite: 12, 16]
  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    axios
      .get('/data/questions.json', { signal: controller.signal })
      .then((res) => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  // Lưu lịch sử khi history thay đổi[cite: 15, 16]
  useEffect(() => {
    localStorage.setItem('ltw_trieuphu_history', JSON.stringify(history));
  }, [history]);

  const handleAddHistory = (record) => {
    setHistory((prev) => [record, ...prev]);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <Home
              playerName={playerName}
              setPlayerName={setPlayerName}
              history={history}
            />
          }
        />
        <Route
          path="play"
          element={
            <Play
              playerName={playerName}
              questions={questions}
              onAddHistory={handleAddHistory}
            />
          }
        />
        <Route path="result" element={<Result />} />
        <Route
          path="history"
          element={
            <History
              history={history}
              onClearHistory={handleClearHistory}
            />
          }
        />
        <Route
          path="questions"
          element={
            loading ? (
              <div>Đang tải câu hỏi...</div>
            ) : error ? (
              <div>Không tải được câu hỏi</div>
            ) : (
              <QuestionBank questions={questions} />
            )
          }
        />
        <Route
          path="questions/:id"
          element={<QuestionDetail questions={questions} />}
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;