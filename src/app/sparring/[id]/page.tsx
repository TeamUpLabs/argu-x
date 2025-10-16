"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Debate } from "@/types/Debate";
import Header from "@/components/sparring/header";
import OpinionCards from "@/components/sparring/OpinionCards";
import ProgressBar from "@/components/sparring/ProgressBar";
import DebateResult from "@/components/sparring/DebateResult";
import { calculateRatiosExcludingToday, calculateRatiosIncludingToday } from "@/components/sparring/utils/calculateRatios";

// 타입 정의
type OpinionType = '찬성' | '반대' | '변동 없음';

// 상수 정의
const SCALE_MIN = 0.7;
const SCALE_MAX = 1;
const SCALE_DIVISOR = 300;
const OPACITY_DIVISOR = 100;
const SCALE_OFFSET = 25;

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

  // URL에서 debate 정보 가져오기
  useEffect(() => {
    const data = searchParams.get('data');
    if (data) {
      setIsLoading(true);
      setError(undefined);
      try {
        const decodedData = JSON.parse(decodeURIComponent(atob(data)));
        setDebate(decodedData);

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
  const headerScale = Math.max(SCALE_MIN, SCALE_MAX - (scrollY - SCALE_OFFSET) / SCALE_DIVISOR);
  const headerOpacity = Math.max(0, SCALE_MAX - (scrollY - SCALE_OFFSET) / OPACITY_DIVISOR);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">데이터를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="text-destructive text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2">오류가 발생했습니다</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center gap-2 justify-between">
        <div className="w-2/3 h-full relative">
          <div className="flex flex-col gap-10 w-full h-full">
            {/* 헤더 */}
            <Header debate={debate} scale={headerScale} opacity={headerOpacity} />

            {/* 내용 */}
            <div className="min-h-[10000px]">
              <div className="relative space-y-8">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}