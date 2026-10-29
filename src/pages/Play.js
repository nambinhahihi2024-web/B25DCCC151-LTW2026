import React, { useState, useEffect, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import MoneyLadder from '../components/MoneyLadder';
import Lifelines from '../components/Lifelines';
import AudienceChart from '../components/AudienceChart';
import { TIME_PER_QUESTION, LETTERS } from '../data';
import { calcPrize, generateAudienceVotes } from '../utils';

const Play = ({ playerName, questions, onAddHistory }) => {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [status, setStatus] = useState('answering'); // 'answering' | 'locked' | 'revealed'
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const [usedLifelines, setUsedLifelines] = useState({ '5050': false, audience: false });
  const [hiddenAnswers, setHiddenAnswers] = useState([]);
  const [audienceVotes, setAudienceVotes] = useState(null);

  const currentQuestion = questions[currentIndex];

  
  useEffect(() => {
    document.title = `Câu ${currentIndex + 1}/15 – ${playerName}`;
    return () => {
      document.title = 'Ai là triệu phú';
    };
  }, [currentIndex, playerName]);


  const finishGame = useCallback((correctCount, reason) => {
    const prize = calcPrize(correctCount, reason);
    const record = {
      id: Date.now(),
      name: playerName,
      prize,
      correctCount,
      playedAt: new Date().toLocaleString('vi-VN')
    };

    onAddHistory(record);
    navigate('/result', {
      replace: true,
      state: { name: playerName, prize, correctCount, reason }
    });
  }, [playerName, onAddHistory, navigate]);

  
  const handleSelectAnswer = useCallback((index) => {
    if (status !== 'answering' || hiddenAnswers.includes(index)) return;

    setSelectedAnswer(index);
    setStatus('locked');
  }, [status, hiddenAnswers]);

  
  useEffect(() => {
    if (status !== 'answering') return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          finishGame(currentIndex, 'timeout');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [status, currentIndex, finishGame]);

  
  useEffect(() => {
    let timeoutId;

    if (status === 'locked') {
    
      timeoutId = setTimeout(() => {
        setStatus('revealed');
      }, 1000);
    } else if (status === 'revealed') {
      timeoutId = setTimeout(() => {
        if (selectedAnswer === currentQuestion.answer) {
          if (currentIndex + 1 === 15) {
            finishGame(15, 'win'); // Thắng câu 15[cite: 13]
          } else {
          
            setCurrentIndex((prev) => prev + 1);
            setTimeLeft(TIME_PER_QUESTION);
            setStatus('answering');
            setSelectedAnswer(null);
            setHiddenAnswers([]);
            setAudienceVotes(null);
          }
        } else {
          finishGame(currentIndex, 'wrong'); // Trả lời sai[cite: 13, 14]
        }
      }, 2000);
    }

    return () => clearTimeout(timeoutId);
  }, [status, selectedAnswer, currentIndex, currentQuestion, finishGame]);

  // Bắt phím tắt A, B, C, D[cite: 15]
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (status !== 'answering') return;
      const key = e.key.toUpperCase();
      const index = LETTERS.indexOf(key);
      if (index !== -1 && !hiddenAnswers.includes(index)) {
        handleSelectAnswer(index);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, hiddenAnswers, handleSelectAnswer]);

  // Dùng quyền 50:50[cite: 15]
  const handleUse5050 = () => {
    if (usedLifelines['5050'] || status !== 'answering') return;

    const wrongIndices = [0, 1, 2, 3].filter((i) => i !== currentQuestion.answer);
    // Shuffle mảng đáp án sai và lấy 2[cite: 15]
    const shuffled = [...wrongIndices].sort(() => 0.5 - Math.random());
    setHiddenAnswers(shuffled.slice(0, 2));
    setUsedLifelines((prev) => ({ ...prev, '5050': true }));
  };

  // Dùng quyền Hỏi khán giả[cite: 15]
  const handleUseAudience = () => {
    if (usedLifelines.audience || status !== 'answering') return;

    const votes = generateAudienceVotes(currentQuestion.answer, hiddenAnswers);
    setAudienceVotes(votes);
    setUsedLifelines((prev) => ({ ...prev, audience: true }));
  };

  // Dừng cuộc chơi[cite: 13, 15]
  const handleStopGame = () => {
    if (status !== 'answering') return;
    finishGame(currentIndex, 'stop');
  };

  // Chặn truy cập thẳng /play khi chưa có tên[cite: 13]
  if (!playerName) {
    return <Navigate to="/" replace />;
  }

  if (!currentQuestion) return <div>Đang tải câu hỏi...</div>;

  return (
    <div className="play-page">
      <div className="play-main">
        <div className="top-bar">
          <Timer timeLeft={timeLeft} />
          <Lifelines
            usedLifelines={usedLifelines}
            status={status}
            onUse5050={handleUse5050}
            onUseAudience={handleUseAudience}
            onStopGame={handleStopGame}
          />
        </div>

        <AudienceChart votes={audienceVotes} />

        <QuestionCard
          questionIndex={currentIndex}
          questionData={currentQuestion}
          status={status}
          selectedAnswer={selectedAnswer}
          hiddenAnswers={hiddenAnswers}
          onSelectAnswer={handleSelectAnswer}
        />
      </div>

      <MoneyLadder currentQuestionIndex={currentIndex} />
    </div>
  );
};

export default Play;