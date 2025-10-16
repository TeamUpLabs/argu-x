"use client";

import Image from "next/image";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Debate } from "@/types/Debate";
import { getFrontImageBrightness, getTextColorClass, getTextOpacityClass } from "./utils/getFrontImageBrightness";
import RotatingText from "@/components/RotatingText";
import { MessageCircleMore, CircleCheckBig } from "lucide-react";

interface DebateCardProps {
  debate: Debate;
}

export default function DebateCard({ debate }: DebateCardProps) {
  const prosRatio = (debate.pros.users.length / (debate.pros.users.length + debate.cons.users.length)) * 100;
  const consRatio = 100 - prosRatio;
  const { isAuthenticated, _hasHydrated } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isExpanding, setIsExpanding] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [frontBackgroundBrightness, setFrontBackgroundBrightness] = useState<'light' | 'dark'>('dark');
  const cardRef = useRef<HTMLDivElement>(null);

  // 앞면 이미지 밝기 감지
  useEffect(() => {
    const detectFrontBrightness = async () => {
      const brightness = await getFrontImageBrightness(debate.img);
      setFrontBackgroundBrightness(brightness);
    };

    if (debate.img) {
      detectFrontBrightness();
    }
  }, [debate.img]);

  const [previousPathname, setPreviousPathname] = useState(pathname);

  const frontTextColorClass = getTextColorClass(frontBackgroundBrightness);
  const frontMutedTextColorClass = getTextOpacityClass(frontBackgroundBrightness, 0.6);

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
          // 페이지 이동 시작
          const debateData = btoa(encodeURIComponent(JSON.stringify(debate)));
          router.push(`/sparring/${debate.id}?data=${debateData}`);
        }, remainingTime);
      }, 100);
    } else {
      toast.error("로그인 후 토론을 확인할 수 있습니다.");
    }
  };

  // 페이지 이동 완료 시 오버레이 숨기기
  useEffect(() => {
    if (pathname !== previousPathname && showOverlay) {
      setIsExpanding(false);
      setShowOverlay(false);
      setPreviousPathname(pathname);
    }
  }, [pathname, previousPathname, showOverlay]);

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
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 z-10 p-7 flex flex-col items-start justify-start max-w-[80%]">
                <span className={`text-xs ${frontMutedTextColorClass}`}>{debate.id} 라운드</span>
                <span className={`text-2xl font-bold ${frontTextColorClass}`}>{debate.title}</span>
              </div>
            </div>
          </div>
          {/* 뒷면 */}
          <div
            className="card-face card-back relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-sm shadow-2xl border border-white/10 transition-all duration-300 hover:shadow-3xl hover:border-white/20"
            role="button"
            tabIndex={0}
            aria-label={`${debate.title} 토론 참여`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleDebateClick();
              }
            }}
          >
            <div className="h-full w-full relative">
              {/* 배경 이미지 - 최적화됨 */}
              <Image
                src={debate.img}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover opacity-10 scale-105 transition-transform duration-700 hover:scale-100"
                priority={false}
                quality={75}
              />

              {/* 서브틀한 오버레이 그라데이션 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-slate-900/20" />

              {/* 메인 콘텐츠 영역 */}
              <div className="absolute inset-0 z-10 p-6 flex flex-col justify-between">
                {/* 상단 정보 영역 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white/80">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">활성 토론</span>
                  </div>
                  <div className="text-xs text-white/60 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                    {debate.id} 라운드
                  </div>
                </div>

                {/* 중앙 메인 콘텐츠 */}
                <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                  {_hasHydrated ? (
                    isAuthenticated() ? (
                      <>
                        {/* 참여율 시각화 - 더 세련되게 */}
                        <div className="w-full max-w-sm mb-6 group">
                          <div className="flex justify-between items-center text-sm text-white/80 mb-3">
                            <span className="font-medium flex items-center gap-2">
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                              참여 현황
                            </span>
                            <span className="text-white/60 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                              🔥 {debate.pros.count + debate.cons.count}명 참여 중
                            </span>
                          </div>

                          {/* 프로그래스 바 - 개선된 사선 알고리즘 */}
                          <div className="relative mb-2">
                            {/* 배경 바 */}
                            <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden backdrop-blur-sm">
                              {/* 찬성 바 - 동적 사선 알고리즘 */}
                              <div
                                className="h-full bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 transition-all duration-2000 ease-out relative overflow-hidden shadow-lg"
                                style={{
                                  width: `${prosRatio + 1}%`,  // 프로그래스 바 끼리 가까워지기 위해 1% 추가
                                  clipPath: prosRatio > consRatio
                                    ? `polygon(0 0%, 100% 0, ${100 - (consRatio / prosRatio) * 7}% 100%, 0% 100%)`
                                    : `polygon(0 0%, 100% 0, 93% 100%, 0% 100%)`
                                }}
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
                              />
                            </div>
                          </div>

                          {/* 퍼센트 라벨 - 호버 효과 추가 */}
                          <div className="flex justify-between text-xs text-white/70 mt-2 font-medium group-hover:text-white/90 transition-colors">
                            <div className="flex items-center gap-2 group-hover:scale-105 transition-transform">
                              <div className="relative">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping absolute" />
                                <div className="w-2 h-2 bg-blue-400 rounded-full relative" />
                              </div>
                              <span className="bg-blue-500/20 backdrop-blur-sm px-2 py-1 rounded-full">
                                찬성 {prosRatio.toFixed(1)}%
                              </span>
                            </div>

                            <div className="flex items-center gap-2 group-hover:scale-105 transition-transform">
                              <div className="relative">
                                <div className="w-2 h-2 bg-red-400 rounded-full animate-ping absolute" />
                                <div className="w-2 h-2 bg-red-400 rounded-full relative" />
                              </div>
                              <span className="bg-purple-500/20 backdrop-blur-sm px-2 py-1 rounded-full">
                                반대 {consRatio.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 토론 주제 애니메이션 - 개선됨 */}
                        <div className="mb-6">
                          <RotatingText
                            texts={[`👎 ${debate.cons.title}`, `👍 ${debate.pros.title}`]}
                            mainClassName="items-center px-6 py-1 bg-indigo-600/90 text-white font-semibold text-base rounded-xl shadow-xl backdrop-blur-sm border border-white/20 hover:border-white/30 transition-all duration-300 hover:shadow-2xl hover:scale-105"
                            staggerFrom="first"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            staggerDuration={0.025}
                            splitLevelClassName="overflow-hidden"
                            transition={{ type: "spring", damping: 25, stiffness: 500 }}
                            rotationInterval={2000}
                          />
                        </div>

                        {/* 참여 유도 메시지 - 더 세련되게 */}
                        <div className="flex items-center gap-2 text-emerald-300/90">
                          <CircleCheckBig className="w-4 h-4 text-emerald-300/90" />
                          <span className="text-sm font-medium">지금 참여하세요</span>
                        </div>
                      </>
                    ) : (
                      /* 로그인 유도 영역 - 심플하고 유저 친화적으로 개선 */
                      <div className="max-w-sm mx-auto text-center">
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-lg">
                          <div className="mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                              <MessageCircleMore className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">토론이 궁금하다면?</h3>
                            <p className="text-white/70 text-sm leading-relaxed">
                              로그인하고 다양한 의견을 확인해보세요!
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  ) : (
                    /* 로딩 상태 - 개선됨 */
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 border-3 border-white/20 border-t-white/60 rounded-full animate-spin" />
                        <div className="absolute inset-0 w-12 h-12 border-3 border-transparent border-t-emerald-400/40 rounded-full animate-spin animation-delay-150" style={{ animationDirection: 'reverse' }} />
                      </div>
                      <div className="text-white/80 font-medium">토론 정보 로딩 중...</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 전체화면 확대 오버레이 - 프로덕션 수준으로 개선 */}
      {showOverlay && (
        <div
          className="fixed inset-0 z-50 bg-black backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="debate-overlay-title"
          aria-describedby="debate-overlay-description"
        >
          <div className={`absolute inset-0 flex items-center justify-center p-4 ${isExpanding ? 'animate-scale-up' : ''}`}>
            <div className="relative w-full h-full">
              {/* 오버레이 콘텐츠 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 rounded-2xl flex items-center justify-center pb-12">
                <div className="text-center text-white max-w-2xl px-8">
                  <div
                    id="debate-overlay-title"
                    className="text-sm font-medium text-white/70 mb-2 tracking-wide uppercase"
                  >
                    {debate.id} 라운드 토론
                  </div>
                  <h2
                    id="debate-overlay-description"
                    className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight"
                  >
                    {debate.title}
                  </h2>

                  {/* 참여율 정보 - 오버레이에서도 표시 */}
                  <div className="inline-flex items-center gap-6 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                      <span className="text-sm font-medium">찬성 {Math.round(prosRatio)}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                      <span className="text-sm font-medium">반대 {Math.round(consRatio)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}