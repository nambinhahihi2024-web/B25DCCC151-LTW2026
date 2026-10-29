import { PRIZES, MILESTONES } from './data';

// Tính tiền thưởng dựa trên số câu trả lời đúng và lý do dừng[cite: 13]
export const calcPrize = (correctCount, reason) => {
  if (reason === 'stop') {
    return correctCount > 0 ? PRIZES[correctCount - 1] : 0;
  }
  if (reason === 'win') {
    return PRIZES[14];
  }
  // Nếu sai hoặc hết giờ, lấy mốc an toàn cao nhất đã vượt qua[cite: 13]
  const passedMilestones = MILESTONES.filter((m) => m <= correctCount);
  if (passedMilestones.length === 0) return 0;
  const maxMilestone = Math.max(...passedMilestones);
  return PRIZES[maxMilestone - 1];
};

// Tính phần trăm khảo sát khán giả
export const generateAudienceVotes = (correctAnswerIndex, hiddenAnswers) => {
  const result = [0, 0, 0, 0];
  const availableIndices = [0, 1, 2, 3].filter((i) => !hiddenAnswers.includes(i));
  const wrongIndices = availableIndices.filter((i) => i !== correctAnswerIndex);

  // Đáp án đúng nhận 40-70%
  const correctPercent = Math.floor(Math.random() * 31) + 40;
  result[correctAnswerIndex] = correctPercent;

  let remaining = 100 - correctPercent;

  wrongIndices.forEach((index, idx) => {
    if (idx === wrongIndices.length - 1) {
      result[index] = remaining;
    } else {
      const share = Math.floor(Math.random() * (remaining + 1));
      result[index] = share;
      remaining -= share;
    }
  });

  return result;
};