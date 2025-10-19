import { Debate } from "@/types/Debate";

// 오늘을 제외한 가장 최신 날짜까지의 찬성과 반대 비율을 계산하는 함수
export const calculateRatiosExcludingToday = (debate: Debate) => {
  const today = new Date().toISOString().split("T")[0];
  const latestProsDate = new Date(
    debate.pros.insights
      .filter((insight) => insight.created_at.split("T")[0] !== today)
      .toSorted(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0].created_at
  )
    .toISOString()
    .split("T")[0];
  const latestConsDate = new Date(
    debate.cons.insights
      .filter((insight) => insight.created_at.split("T")[0] !== today)
      .toSorted(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0].created_at
  )
    .toISOString()
    .split("T")[0];

  const prosCount = debate.pros.insights.filter(
    (insight) => insight.created_at.split("T")[0] !== today
  ).length;
  const consCount = debate.cons.insights.filter(
    (insight) => insight.created_at.split("T")[0] !== today
  ).length;

  const total = prosCount + consCount;
  const prosRatio = total > 0 ? (prosCount / total) * 100 : 0;
  const consRatio = total > 0 ? (consCount / total) * 100 : 0;

  return { prosRatio, consRatio, latestProsDate, latestConsDate };
};

// 오늘을 포함한 찬성과 반대 비율을 계산하는 함수
export const calculateRatiosIncludingToday = (debate: Debate) => {
  const prosCount = debate.pros.insights.length; // 오늘을 포함한 모든 pros 투표
  const consCount = debate.cons.insights.length; // 오늘을 포함한 모든 cons 투표

  const total = prosCount + consCount;
  const prosRatio = total > 0 ? (prosCount / total) * 100 : 0;
  const consRatio = total > 0 ? (consCount / total) * 100 : 0;

  return { prosRatio, consRatio };
};
