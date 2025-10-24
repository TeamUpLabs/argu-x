import { Insight } from "@/types/Debate";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { getRelativeDate } from "@/lib/getRelativeDate";

interface InsightCardProps {
  insight: Insight;
  opinion: 'pros' | 'cons';
  onVoteClick?: (insight: Insight) => void;
  isSelected?: boolean;
}

const getUserColor = (name: string) => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-cyan-500'
  ];
  const index = [...name].reduce((acc, char) => acc + char.codePointAt(0)!, 0) % colors.length;
  return colors[index];
};

export default function InsightCard({ insight, opinion, onVoteClick, isSelected = false }: InsightCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = () => {
    if (onVoteClick) {
      onVoteClick(insight);
    }
  };

  const handleVoteButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleCardClick();
  };

  return (
    <div
      className={`
        group relative overflow-hidden rounded-lg border transition-all duration-200 ease-in-out cursor-pointer
        ${isSelected
          ? 'border-foreground shadow-sm'
          : (isHovered
            ? 'border-border bg-muted/30'
            : 'border-border bg-muted/50 hover:border-border/80')
        }
      `}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4">
        {/* 헤더 섹션 */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* 프로필 이미지 - 색상 추가 */}
            <div className="relative">
              <div className={`
                w-10 h-10 rounded-full overflow-hidden border transition-all duration-200 shadow-sm
                ${isSelected ? 'border-foreground shadow-md' : 'border-border hover:border-foreground/50'}
              `}>
                <div className={`w-full h-full flex items-center justify-center text-white font-medium text-sm ${getUserColor(insight.creator.name)}`}>
                  {insight.creator.name.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="font-medium text-sm text-foreground">
                  {insight.creator.name}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {getRelativeDate(insight.created_at)}
                </div>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <TrendingUp className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {insight.voted_count || 0} votes
                </span>
              </div>
            </div>
          </div>

          {/* 의견 배지 - 색상으로 구분 */}
          <Badge
            variant="outline"
            className={`
              px-2 py-1 text-xs font-medium border transition-all duration-200
              ${opinion === 'pros'
                ? 'bg-blue-200/20 text-blue-500 border-blue-500 dark:bg-blue-800/20 dark:text-blue-500 dark:border-blue-800'
                : 'bg-red-200/20 text-red-500 border-red-500 dark:bg-red-800/20 dark:text-red-500 dark:border-red-800'
              }
            `}
          >
            {opinion === 'pros' ? '찬성' : '반대'}
          </Badge>
        </div>

        {/* 인사이트 내용 */}
        <div className="mb-4">
          <p className="text-sm leading-relaxed text-foreground">
            {insight.content}
          </p>
        </div>

        {/* 하단 액션 영역 */}
        <div className="flex items-center justify-end pt-3 border-t border-border">
          {/* 투표하기 버튼 */}
          <Button
            variant={isSelected ? "default" : "outline"}
            size="sm"
            className={`
              text-xs font-medium transition-all duration-200
              ${isSelected
                ? 'bg-foreground hover:bg-foreground/90 text-background border-foreground'
                : 'border-border hover:border-foreground hover:bg-muted/50 hover:text-foreground'
              }
            `}
            onClick={handleVoteButtonClick}
          >
            {isSelected ? '선택됨' : '투표하기'}
          </Button>
        </div>
      </div>
    </div>
  );
}