import React from 'react';
import { ArrowBigUp } from 'lucide-react';
import { getRelativeDate } from '@/components/sparring/utils/getRelativeDate';

export type OpinionType = '찬성' | '반대' | '변동 없음';

interface DebateResultProps {
  prosRatio: number;
  consRatio: number;
  opinion: OpinionType;
  percentage: number;
  latestProsDate: string;
  latestConsDate: string;
}

export default function DebateResult({
  prosRatio,
  consRatio,
  opinion,
  percentage,
  latestProsDate,
  latestConsDate
}: DebateResultProps) {
  return (
    <div className="bg-muted flex flex-col gap-2 p-2 rounded-lg border border-border" role="region" aria-label="토론 결과">
      <div className="flex items-end justify-between">
        <div className="flex flex-col flex-1 items-center">
          <span className="text-blue-700 font-bold">그렇다</span>
          <span className="text-foreground text-3xl font-bold" aria-label={`${prosRatio.toFixed(1)} 퍼센트`}>{prosRatio.toFixed(1)}%</span>
        </div>
        <span className="text-muted-foreground font-bold pt-4 px-4" aria-label="대">VS</span>
        <div className="flex flex-col flex-1 items-center">
          <span className="text-red-700 font-bold">아니다</span>
          <span className="text-foreground text-3xl font-bold" aria-label={`${consRatio.toFixed(1)} 퍼센트`}>{consRatio.toFixed(1)}%</span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-1 p-2 bg-background rounded-xl border border-border">
        {opinion === '변동 없음' ? (
          <span className="text-muted-foreground font-bold">{opinion}</span>
        ) : (
          <>
            <span className="text-muted-foreground font-bold">{opinion == '찬성' ? getRelativeDate(latestProsDate) : getRelativeDate(latestConsDate)}보다</span>
            <span className={`font-bold ${opinion == '찬성' ? 'text-blue-700' : 'text-red-700'}`}>{opinion}</span>
            <span className={`font-bold ${opinion == '찬성' ? 'text-blue-700' : 'text-red-700'}`} aria-label={`${percentage.toFixed(1)} 퍼센트 포인트`}>{percentage.toFixed(1)}%</span>
            <ArrowBigUp size={18} fill={opinion == '찬성' ? 'blue' : 'red'} color={opinion == '찬성' ? 'blue' : 'red'} aria-label={`${opinion} 방향 화살표`} />
          </>
        )}
      </div>
    </div>
  );
}
