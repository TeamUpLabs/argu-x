"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Debate } from "@/types/Debate";
import Header from "@/components/sparring/header";
import OpinionCards from "@/components/sparring/OpinionCards";
import ProgressBar from "@/components/sparring/ProgressBar";
import DebateResult, { OpinionType } from "@/components/sparring/DebateResult";
import { calculateRatiosExcludingToday, calculateRatiosIncludingToday } from "@/components/sparring/utils/calculateRatios";
import ParticipationTrend from "@/components/sparring/charts/ParticipationTrend";
import OpinionDistribution from "@/components/sparring/charts/OpinionDistribution";
import ChartFilter from "@/components/sparring/charts/filter";
import InsightsFilter from "@/components/sparring/insights/filter";
import InsightCard from "@/components/sparring/insights/InsightCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Comments from "@/components/sparring/Comments";
import { decompressData } from "@/lib/compression";
import Order from "@/components/sparring/Order";
import { Loading } from "@/components/common/Loading";

// 상수 정의
const SCALE_MIN = 0.7;
const SCALE_MAX = 1;
const SCALE_DIVISOR = 300;
const OPACITY_DIVISOR = 100;
const SCALE_OFFSET = 0;

export default function SparringPage() {
  const [scrollY, setScrollY] = useState(0);
  const [debate, setDebate] = useState<Debate | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const searchParams = useSearchParams();
  const [prosRatio, setProsRatio] = useState(0);
  const [consRatio, setConsRatio] = useState(0);
  const [opinion, setOpinion] = useState<OpinionType>('변동 없음');
  const [percentage, setPercentage] = useState(0);
  const [latestProsDate, setLatestProsDate] = useState('');
  const [latestConsDate, setLatestConsDate] = useState('');
  const [participationData, setParticipationData] = useState<{ date: string; pros: number; cons: number; }[]>([]);
  const [opinionType, setOpinionType] = useState<'pros' | 'cons'>('pros');
  const [sortType, setSortType] = useState<'latest' | 'popular'>('latest');
  const [chartType, setChartType] = useState<'participation' | 'opinion'>('participation');
  const [selectedInsight, setSelectedInsight] = useState<Debate['pros']['insights'][0] | Debate['cons']['insights'][0] | null>(null);
  const [selectedInsightOpinionType, setSelectedInsightOpinionType] = useState<'pros' | 'cons'>('pros');

  // 선택된 인사이트를 처리하는 핸들러
  const handleInsightVoteClick = (insight: Debate['pros']['insights'][0] | Debate['cons']['insights'][0]) => {
    setSelectedInsight(insight);
    setSelectedInsightOpinionType(opinionType);
  };

  // Debate 인사이트 데이터를 Order 컴포넌트 형식으로 변환
  const convertInsightToOrderData = (insight: Debate['pros']['insights'][0] | Debate['cons']['insights'][0], opinionType: 'pros' | 'cons') => {
    // 결정론적 토큰 스테이킹 계산 (랜덤 요소 제거)
    const baseStake = insight.voted_count || 0;
    const totalStaked = Math.max(100, baseStake * 50 + 100); // voted_count당 50토큰 + 기본 100토큰

    return {
      id: insight.id,
      author: insight.creator.name,
      title: insight.content,
      opinion: opinionType,
      currentVotes: insight.voted_count || 0,
      totalStaked: totalStaked,
      supportRatio: 50, // 임시 데이터 - 실제로는 계산 필요
      challengeRatio: 50 // 임시 데이터 - 실제로는 계산 필요
    };
  };

  // 토론 참여 추이 데이터 생성 함수
  const generateParticipationData = (debate: Debate) => {
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

  useEffect(() => {
    const data = searchParams.get('data');
    if (data) {
      setIsLoading(true);
      setError(undefined);
      try {
        const decodedData = decompressData(data) as Debate;
        setDebate(decodedData);

        const participationChartData = generateParticipationData(decodedData);
        setParticipationData(participationChartData);

        const { prosRatio: prosRatioExcludingToday, consRatio: consRatioExcludingToday, latestProsDate, latestConsDate } = calculateRatiosExcludingToday(decodedData);
        const { prosRatio: prosRatioIncludingToday, consRatio: consRatioIncludingToday } = calculateRatiosIncludingToday(decodedData);

        setProsRatio(prosRatioIncludingToday);
        setConsRatio(consRatioIncludingToday);
        setLatestProsDate(latestProsDate);
        setLatestConsDate(latestConsDate);

        const prosRatioDifference = prosRatioExcludingToday - prosRatioIncludingToday;
        const consRatioDifference = consRatioExcludingToday - consRatioIncludingToday;

        if (prosRatioDifference > consRatioDifference) {
          setOpinion('찬성');
          setPercentage(prosRatioDifference);
        } else if (prosRatioDifference < consRatioDifference) {
          setOpinion('반대');
          setPercentage(consRatioDifference);
        } else {
          setOpinion('변동 없음');
          setPercentage(0);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to decode debate data:', error);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        setIsLoading(false);
      }
    } else {
      setError('토론 데이터를 찾을 수 없습니다.');
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 스크롤에 따른 헤더 스케일 및 투명도 계산 (최소 0.7, 최대 1.0)
  // 헤더의 높이가 24px이므로, 24px를 뺀 값으로 계산
  const headerScale = Math.max(SCALE_MIN, Math.round((SCALE_MAX - (scrollY - SCALE_OFFSET) / SCALE_DIVISOR) * 1000) / 1000);
  const headerOpacity = Math.max(0, Math.round((SCALE_MAX - (scrollY - SCALE_OFFSET) / OPACITY_DIVISOR) * 1000) / 1000);

  if (isLoading) {
    return (
      <Loading className="flex items-center justify-center min-h-[50vh]" />
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="text-destructive text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">오류가 발생했습니다</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex gap-2 justify-between">
        <div className="w-2/3 h-full relative">
          <div className="flex flex-col w-full h-full">
            {/* 헤더 */}
            <Header debate={debate} scale={headerScale} opacity={headerOpacity} />

            {/* 내용 */}
            <div className="py-5 z-1">
              <div className="relative space-y-8 px-1">
                <div className="space-y-2">
                  {debate && <OpinionCards debate={debate} />}
                  <ProgressBar prosRatio={prosRatio} consRatio={consRatio} />
                </div>

                {/* 토론 내용 */}
                <DebateResult
                  prosRatio={prosRatio}
                  consRatio={consRatio}
                  opinion={opinion}
                  percentage={percentage}
                  latestProsDate={latestProsDate}
                  latestConsDate={latestConsDate}
                />

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-6 bg-foreground rounded-full"></div>
                        <span className="text-foreground font-bold text-xl">
                          INSIGHTS
                        </span>
                      </div>
                      <div className="flex px-3 py-0.5 justify-center items-center bg-muted rounded-full border border-border">
                        <span className="text-xs font-medium text-foreground">
                          {opinionType === 'pros' ? debate?.pros?.insights?.length || 0 : debate?.cons?.insights?.length || 0}개
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tabs defaultValue="pros" className="gap-0">
                        <TabsList>
                          <TabsTrigger
                            value="pros"
                            onClick={() => setOpinionType('pros')}
                            className="transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                          >
                            찬성
                          </TabsTrigger>
                          <TabsTrigger
                            value="cons"
                            onClick={() => setOpinionType('cons')}
                            className="transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                          >
                            반대
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                      <InsightsFilter sortType={sortType} setSortType={setSortType} />
                    </div>
                  </div>

                  {/* 인사이트 카드 그리드 */}
                  <div className="space-y-3">
                    {opinionType === 'pros' ? (
                      debate?.pros?.insights && debate.pros.insights.length > 0 ? (
                        debate.pros.insights
                          ?.toSorted((a, b) => {
                            return sortType === 'latest'
                              ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                              : (b.voted_count || 0) - (a.voted_count || 0);
                          })
                          ?.map((insight, index) => (
                            <div
                              key={insight.id}
                              className="animate-in fade-in-0 slide-in-from-bottom-1 duration-200"
                              style={{ animationDelay: `${index * 30}ms` }}
                            >
                              <InsightCard
                                insight={insight}
                                opinion={opinionType}
                                onVoteClick={handleInsightVoteClick}
                                isSelected={selectedInsight?.id === insight.id}
                              />
                            </div>
                          ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl text-slate-400">💭</span>
                          </div>
                          <h3 className="text-lg font-medium text-slate-900 mb-2">아직 찬성 인사이트가 없습니다</h3>
                          <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
                            이 토론에 대한 첫 번째 찬성 의견을 남겨보세요.
                          </p>
                        </div>
                      )
                    ) : (
                      debate?.cons?.insights && debate.cons.insights.length > 0 ? (
                        debate.cons.insights
                          ?.toSorted((a, b) => {
                            return sortType === 'latest'
                              ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                              : (b.voted_count || 0) - (a.voted_count || 0);
                          })
                          ?.map((insight, index) => (
                            <div
                              key={insight.id}
                              className="animate-in fade-in-0 slide-in-from-bottom-1 duration-200"
                              style={{ animationDelay: `${index * 30}ms` }}
                            >
                              <InsightCard
                                insight={insight}
                                opinion={opinionType}
                                onVoteClick={handleInsightVoteClick}
                                isSelected={selectedInsight?.id === insight.id}
                              />
                            </div>
                          ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl text-slate-400">💬</span>
                          </div>
                          <h3 className="text-lg font-medium text-slate-900 mb-2">아직 반대 인사이트가 없습니다</h3>
                          <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
                            이 토론에 대한 첫 번째 반대 의견을 남겨보세요.
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-6 bg-foreground rounded-full"></div>
                      <span className="text-foreground font-bold text-xl">
                        CHARTS
                      </span>
                    </div>
                    <ChartFilter chartType={chartType} setChartType={setChartType} />
                  </div>
                  {/* 토론 참여 추이 차트 */}
                  {chartType === 'participation' && (
                    <ParticipationTrend participationData={participationData} />
                  )}

                  {/* 토론 의견 분포 차트 */}
                  {chartType === 'opinion' && (
                    <OpinionDistribution prosCount={debate?.pros?.insights?.length || 0} consCount={debate?.cons?.insights?.length || 0} />
                  )}
                </div>

                <Tabs defaultValue="comments">
                  <TabsList>
                    <TabsTrigger value="comments">Comments ({debate?.comments?.length || 0})</TabsTrigger>
                    <TabsTrigger value="top_holders">Top Holders</TabsTrigger>
                  </TabsList>
                  <TabsContent value="comments">
                    <Comments comments={debate?.comments || []} />
                  </TabsContent>
                  <TabsContent value="top_holders">

                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/3 h-full pt-4 sticky top-[101px]">
          <div className="h-full max-h-[calc(100vh-120px)] overflow-y-auto pr-2">
            <Order selectedInsight={selectedInsight ? convertInsightToOrderData(selectedInsight, selectedInsightOpinionType) : undefined} debate={debate} />
          </div>
        </div>
      </div>
    </div>
  )
}