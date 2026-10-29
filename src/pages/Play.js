import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import MoneyLadder from '../components/MoneyLadder';
import Lifelines from '../components/Lifelines';
import AudienceChart from '../components/AudienceChart';
import { TIME_PER_QUESTION, LETTERS } from '../data';
import { calcPrize, generateAudienceVotes } from '../utils';

const Play = ({ questions, playerName, onGameEnd }) => {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [selectedOption, setSelectedOption] = useState(null);
  // status: "answering" | "locked" | "revealed"
  const [status, setStatus] = useState('answering');
  
  const [hiddenIndices, setHiddenIndices] = useState([]);
  const [audienceVotes, setAudienceVotes] = useState(null);
  const [usedLifelines, setUsedLifelines] = useState({ fiftyFifty: false, audience: false });

  const currentQuestion = questions[currentIndex];

  // Đổi tiêu đề tab trình duyệt khi chơi
  useEffect(() => {
    document.title = `Câu ${currentIndex + 1}/15 – ${playerName}`;
    return () => {
      document.title = 'Ai là triệu phú';
    };
  }, [currentIndex, playerName]);

  // Quản lý đếm ngược 30s[cite: 5, 7]
  useEffect(() => {
    if (status !== 'answering') return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [status, currentIndex]);

  // Quản lý tiến trình sau khi chốt đáp án[cite: 5, 7]
  useEffect(() => {
    let timeoutId;
    if (status === 'locked') {
      timeoutId = setTimeout(() => {
        setStatus('revealed');
      }, 1000);
    } else if (status === 'revealed') {
      timeoutId = setTimeout(() => {
        if (selectedOption === currentQuestion.answer) {
          // Đúng: chuyển câu tiếp theo hoặc thắng cuộc
          if (currentIndex + 1 < questions.length) {
            setCurrentIndex((prev) => prev + 1);
            setTimeLeft(TIME_PER_QUESTION);
            setSelectedOption(null);
            setHiddenIndices([]);
            setAudienceVotes(null);
            setStatus('answering');
          } else {
            // Thắng 15 câu
            endGame(15, 'win');
          }
        } else {
          // Sai
          endGame(currentIndex, 'wrong');
        }
      }, 2000);
    }

    return () => clearTimeout(timeoutId);
  }, [status, selectedOption, currentIndex, questions, currentQuestion]);

  // Phím tắt A, B, C, D[cite: 6, 7]
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (status !== 'answering') return;
      const key = e.key.toUpperCase();
      const index = LETTERS.indexOf(key);

      if (index !== -1 && !hiddenIndices.includes(index)) {
        handleSelectAnswer(index);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, hiddenIndices]);

  if (!playerName) {
    return <Navigate to="/" replace />;
  }

  if (!questions || questions.length === 0) {
    return <div>Đang tải dữ liệu câu hỏi...</div>;
  }

  const handleSelectAnswer = (index) => {
    if (status !== 'answering') return;
    setSelectedOption(index);
    setStatus('locked');
  };

  const handleTimeOut = () => {
    setStatus('revealed');
    setTimeout(() => {
      endGame(currentIndex, 'timeout');
    }, 2000);
  };

  const endGame = (correctCount, reason) => {
    const prize = calcPrize(correctCount, reason);
    onGameEnd({ name: playerName, prize, correctCount });
    navigate('/result', {
      replace: true,
      state: { playerName, prize, correctCount, reason }
    });
  };

  // Trợ giúp 50:50[cite: 6]
  const handleUse5050 = () => {
    if (usedLifelines.fiftyFifty || status !== 'answering') return;

    const wrongIndices = [0, 1, 2, 3].filter((i) => i !== currentQuestion.answer);
    // Chọn ngẫu nhiên 2 đáp án sai để ẩn
    const shuffled = wrongIndices.sort(() => 0.5 - Math.random());
    setHiddenIndices([shuffled[0], shuffled[1]]);
    setUsedLifelines((prev) => ({ ...prev, fiftyFifty: true }));
  };

  // Trợ giúp Hỏi khán giả[cite: 6]
  const handleAskAudience = () => {
    if (usedLifelines.audience || status !== 'answering') return;

    const votes = generateAudienceVotes(currentQuestion.answer, hiddenIndices);
    setAudienceVotes(votes);
    setUsedLifelines((prev) => ({ ...prev, audience: true }));
  };

  // Dừng cuộc chơi[cite: 6]
  const handleStopGame = () => {
    if (status !== 'answering') return;
    endGame(currentIndex, 'stop');
  };

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ flex: 1 }}>
        <Lifelines
          usedLifelines={usedLifelines}
          onUse5050={handleUse5050}
          onAskAudience={handleAskAudience}
          onStopGame={handleStopGame}
          disabled={status !== 'answering'}
        />

        <Timer timeLeft={timeLeft} />

        <QuestionCard
          question={currentQuestion}
          index={currentIndex}
          total={questions.length}
          hiddenIndices={hiddenIndices}
          selectedOption={selectedOption}
          status={status}
          onSelectAnswer={handleSelectAnswer}
        />

        {audienceVotes && <AudienceChart votes={audienceVotes} />}
      </div>

      <MoneyLadder currentQuestionIndex={currentIndex} />
    </div>
  );
};

export default Play;