"use client";

import { Bookmark, Link } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { Debate } from "@/types/Debate";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function SparringPage() {
  const [scrollY, setScrollY] = useState(0);
  const [debate, setDebate] = useState<Debate | undefined>();
  const searchParams = useSearchParams();

  // URL에서 debate 정보 가져오기
  useEffect(() => {
    const data = searchParams.get('data');
    if (data) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(atob(data)));
        setDebate(decodedData);
      } catch (error) {
        console.error('Failed to decode debate data:', error);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 스크롤에 따른 스케일 계산 (최소 0.7, 최대 1.0)
  // 헤더의 높이가 24px이므로, 24px를 뺀 값으로 계산
  const scale = Math.max(0.7, 1 - (scrollY - 25) / 300);
  const opacity = Math.max(0, 1 - (scrollY - 25) / 100);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center gap-2 justify-between">
        <div className="w-2/3 h-full relative">
          <div className="flex flex-col w-full h-full">
            {/* 헤더 */}
            <div className="flex items-center justify-between sticky top-25 z-10 pt-4 pb-1">
              <div className={`flex items-center gap-4 origin-center origin-left`} style={{ transform: `scale(${scale})` }}>
                {debate ? (
                  <>
                    <div className="bg-muted aspect-square rounded-md w-16 h-16 relative overflow-hidden">
                      <Image
                        src={debate.img}
                        alt={debate.title}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <span className="text-foreground font-bold text-2xl">{debate.title}</span>
                  </>
                ) : (
                  <>
                    <div className="bg-muted aspect-square rounded-md w-16 h-16">
                      {/* TODO: 이미지 */}
                    </div>
                    <span className="text-foreground font-bold text-2xl">토론 이름</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Link />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>링크 복사</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" size="icon">
                  <Bookmark />
                </Button>
              </div>
              <div className="w-full h-px absolute bottom-0 left-0 bg-border" style={{ opacity: 1 - opacity }}></div>
            </div>

            {/* 내용 */}
            <div className="min-h-[10000px]">

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}