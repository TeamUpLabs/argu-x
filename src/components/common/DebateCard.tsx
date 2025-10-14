"use client";

import Link from "next/link";
import Image from "next/image";
import { useUserStore } from "@/store/userStore";

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

  return (
    <Link href="#" className="card-flip-container aspect-[9/16]">
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
    </Link>
  )
}