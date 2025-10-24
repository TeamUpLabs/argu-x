import { Debate } from "@/types/Debate";

/**
 * 토론 참여 추이 데이터 생성 함수
 */
export const generateParticipationData = (debate: Debate) => {
  if (!debate.pros?.insights || !debate.cons?.insights) {
    return [];
  }

  const dailyParticipation: { [key: string]: { date: string; pros: number; cons: number } } = {};

  // Pros 데이터 처리
  if (debate.pros?.insights) {
    for (const insight of debate.pros.insights) {
      const date = new Date(insight.created_at).toISOString().split('T')[0];
      if (!dailyParticipation[date]) {
        dailyParticipation[date] = { date, pros: 0, cons: 0 };
      }
      dailyParticipation[date].pros += 1;
    }
  }

  // Cons 데이터 처리
  if (debate.cons?.insights) {
    for (const insight of debate.cons.insights) {
      const date = new Date(insight.created_at).toISOString().split('T')[0];
      if (!dailyParticipation[date]) {
        dailyParticipation[date] = { date, pros: 0, cons: 0 };
      }
      dailyParticipation[date].cons += 1;
    }
  }

  const allUsers = [...(debate.pros?.insights || []), ...(debate.cons?.insights || [])];
  if (allUsers.length === 0) {
    return [];
  }

  const sortedUsers = allUsers.toSorted((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  const oldestDate = new Date(sortedUsers[0].created_at);
  const currentDateObj = new Date();
  const currentDateString = currentDateObj.toISOString().split('T')[0];

  const dateRange: string[] = [];
  const startDate = new Date(oldestDate);

  const endDate = new Date(currentDateString + 'T23:59:59.999Z');

  while (startDate.getTime() <= endDate.getTime()) {
    const dateStr = startDate.toISOString().split('T')[0];
    dateRange.push(dateStr);
    startDate.setDate(startDate.getDate() + 1);
  }

  return dateRange.map(date => ({
    date,
    pros: dailyParticipation[date]?.pros || 0,
    cons: dailyParticipation[date]?.cons || 0,
  }));
};
