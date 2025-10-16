import React from 'react';

interface ProgressBarProps {
  prosRatio: number;
  consRatio: number;
}

export default function ProgressBar({ prosRatio, consRatio }: ProgressBarProps) {
  return (
    <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden backdrop-blur-sm" role="img" aria-label={`찬성 ${prosRatio.toFixed(1)}% 대 반대 ${consRatio.toFixed(1)}%`}>
      {/* 찬성 바 - 동적 사선 알고리즘 */}
      <div
        className="h-full bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 transition-all duration-2000 ease-out relative overflow-hidden shadow-lg"
        style={{
          width: `${prosRatio + 1}%`,  // 프로그래스 바 끼리 가까워지기 위해 1% 추가
          clipPath: prosRatio > consRatio
            ? `polygon(0 0%, 100% 0, ${100 - (consRatio / prosRatio) * 7}% 100%, 0% 100%)`
            : `polygon(0 0%, 100% 0, 93% 100%, 0% 100%)`
        }}
        aria-label={`찬성 ${prosRatio.toFixed(1)}%`}
      />

      {/* 반대 바 - 동적 사선 알고리즘 */}
      <div
        className="absolute top-0 h-full bg-gradient-to-l from-red-300 via-red-400 to-red-500 transition-all duration-2000 ease-out shadow-lg"
        style={{
          width: `${consRatio + 1}%`,  // 프로그래스 바 끼리 가까워지기 위해 1% 추가
          right: 0,
          left: 'auto',
          clipPath: consRatio > prosRatio
            ? `polygon(${prosRatio / consRatio * 7}% 0, 100% 0, 100% 100%, 0% 100%)`
            : `polygon(7% 0, 100% 0, 100% 100%, 0% 100%)`
        }}
        aria-label={`반대 ${consRatio.toFixed(1)}%`}
      />
    </div>
  );
}
