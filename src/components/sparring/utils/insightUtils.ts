import { Debate } from "@/types/Debate";

type InsightType = Debate['pros']['insights'][0] | Debate['cons']['insights'][0];

/**
 * 인사이트 클릭 핸들러
 */
export const handleInsightVoteClick = (
  insight: InsightType,
  setSelectedInsight: (insight: InsightType | null) => void,
  setSelectedInsightOpinionType: (type: 'pros' | 'cons') => void,
  opinionType: 'pros' | 'cons'
) => {
  setSelectedInsight(insight);
  setSelectedInsightOpinionType(opinionType);
};

/**
 * Debate 인사이트 데이터를 Order 컴포넌트 형식으로 변환
 */
export const convertInsightToOrderData = (
  insight: InsightType,
  opinionType: 'pros' | 'cons'
) => {
  // 결정론적 토큰 스테이킹 계산 (랜덤 요소 제거)

  return {
    id: insight.id,
    author: insight.creator.name,
    title: insight.content,
    opinion: opinionType,
    currentVotes: insight.voted_count || 0,
    totalStaked: insight.argx_amount || 0,
  };
};
