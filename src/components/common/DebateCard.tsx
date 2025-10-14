"use client";

import Image from "next/image";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

interface Debate {
  id: number;
  title: string;
  img: string;
  cons: {
    title: string;
    count: number;
    users: {
      id: number;
      name: string;
      voted_at: string;
    }[]
  }
  pros: {
    title: string;
    count: number;
    users: {
      id: number;
      name: string;
      voted_at: string;
    }[]
  }
}

interface DebateCardProps {
  debate: Debate;
}

export default function DebateCard({ debate }: DebateCardProps) {
  const prosRatio = debate.pros.count / (debate.pros.count + debate.cons.count) * 100;
  const consRatio = 100 - prosRatio;
  const { isAuthenticated } = useUserStore();
  const router = useRouter();
  const [isExpanding, setIsExpanding] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDebateClick = async () => {
    if (isAuthenticated()) {
      setIsExpanding(true);
      setShowOverlay(true);

      // 페이지를 미리 로드
      router.prefetch(`/sparring/${debate.id}`);

      // 최소 0.5초는 보여주도록 보장하면서 자연스러운 전환
      const minDisplayTime = 500;
      const startTime = Date.now();

      // 첫 번째 시도 (100ms 후) - 빠른 응답을 위해
      setTimeout(() => {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(50, minDisplayTime - elapsedTime); // 최소 50ms 더 대기

        setTimeout(() => {
          router.push(`/sparring/${debate.id}`);
        }, remainingTime);
      }, 100);
    } else {
      toast.error("로그인 후 토론을 확인할 수 있습니다.");
    }
  };

  // 확대 애니메이션 완료 후 오버레이 숨기기
  useEffect(() => {
    if (isExpanding) {
      const timer = setTimeout(() => {
        setIsExpanding(false);
        setShowOverlay(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isExpanding]);

  return (
    <>
      <div
        ref={cardRef}
        className={`card-flip-container aspect-[9/16] cursor-pointer ${isExpanding ? 'animate-expand' : ''}`}
        onClick={handleDebateClick}
      >
        <div className="card-flip-inner">
          {/* 앞면 */}
          <div className="card-face bg-muted backdrop-blur-sm shadow-lg">
            <div className="h-full w-full relative">
              <Image
                src={debate.img}
                alt="background image"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 z-10 p-6 flex flex-col items-start justify-start max-w-[80%]">
                <span className="text-xs text-white/60">{debate.id} 라운드</span>
                <span className="text-2xl font-bold text-white">{debate.title}</span>
              </div>
            </div>
          </div>
          {/* 뒷면 */}
          <div className="card-face card-back bg-muted backdrop-blur-sm shadow-lg">
            <div className="h-full w-full relative">
              <Image
                src={debate.img}
                alt="background image"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 z-10 px-4 py-6 flex flex-col gap-3 items-center justify-center text-center">
                {isAuthenticated() ? (
                  <>
                    <span className="text-lg font-bold text-white">토론 결과</span>
                    <div className="flex flex-col text-xs text-white/60">
                      <span>찬성: {prosRatio}%</span>
                      <span>반대: {consRatio}%</span>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-lg font-bold text-white">토론 결과가 궁금하다면?</span>
                    <div className="flex flex-col text-xs text-white/80">
                      <span>로그인 후 확인 가능합니다.</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 전체화면 확대 오버레이 */}
      {showOverlay && (
        <div className="fixed inset-0 z-50 bg-black animate-fade-in">
          <div className={`absolute inset-0 flex items-center justify-center ${isExpanding ? 'animate-scale-up' : ''}`}>
            <div className="relative w-full h-full">
              <Image
                src={debate.img}
                alt="background image"
                fill
                className="object-cover rounded-lg"
                priority
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-sm opacity-60">{debate.id} 라운드</div>
                  <div className="text-xl font-bold">{debate.title}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}