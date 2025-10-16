import { Debate } from "@/types/Debate";

// 오늘을 제외한 가장 최신 날짜까지의 찬성과 반대 비율을 계산하는 함수
export const calculateRatiosExcludingToday = (debate: Debate) => {
  const today = new Date().toISOString().split("T")[0]; // e.g., '2025-10-16'
  const latestProsDate = new Date(
    debate.pros.users
      .filter((user) => user.voted_at.split("T")[0] !== today)
      .toSorted(
        (a, b) =>
          new Date(b.voted_at).getTime() - new Date(a.voted_at).getTime()
      )[0].voted_at
  )
    .toISOString()
    .split("T")[0]; // e.g., '2025-10-16'
  const latestConsDate = new Date(
    debate.cons.users
      .filter((user) => user.voted_at.split("T")[0] !== today)
      .toSorted(
        (a, b) =>
          new Date(b.voted_at).getTime() - new Date(a.voted_at).getTime()
      )[0].voted_at
  )
    .toISOString()
    .split("T")[0]; // e.g., '2025-10-16'

  const prosCount = debate.pros.users.filter(
    (user) => user.voted_at.split("T")[0] !== today
  ).length;
  const consCount = debate.cons.users.filter(
    (user) => user.voted_at.split("T")[0] !== today
  ).length;

  const total = prosCount + consCount;
  const prosRatio = total > 0 ? (prosCount / total) * 100 : 0;
  const consRatio = total > 0 ? (consCount / total) * 100 : 0;

  return { prosRatio, consRatio, latestProsDate, latestConsDate };
};

// 오늘을 포함한 찬성과 반대 비율을 계산하는 함수
export const calculateRatiosIncludingToday = (debate: Debate) => {
  const prosCount = debate.pros.users.length; // 오늘을 포함한 모든 pros 투표
  const consCount = debate.cons.users.length; // 오늘을 포함한 모든 cons 투표

  const total = prosCount + consCount;
  const prosRatio = total > 0 ? (prosCount / total) * 100 : 0;
  const consRatio = total > 0 ? (consCount / total) * 100 : 0;

  return { prosRatio, consRatio };
};
