import { Insight } from "@/types/Debate";

type InsightType = Insight;

/**
 * 인사이트 클릭 핸들러
 */
export const handleInsightVoteClick = (
  insight: InsightType,
  setSelectedInsight: (insight: InsightType | null) => void
) => {
  setSelectedInsight(insight);
};

/**
 * Debate 인사이트 데이터를 Order 컴포넌트 형식으로 변환
 */
export const convertInsightToOrderData = (
  insight: InsightType
) => {
  // insight가 이미 필요한 정보를 모두 가지고 있으므로 그대로 반환
  return insight;
};
