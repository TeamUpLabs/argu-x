import { Insight } from "@/types/Debate";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InsightCardProps {
  insight: Insight;
  opinion: 'pros' | 'cons';
  onVoteClick?: (insight: Insight) => void;
}

export default function InsightCard({ insight, opinion, onVoteClick }: InsightCardProps) {
  const handleCardClick = () => {
    if (onVoteClick) {
      onVoteClick(insight);
    }
  };

  const handleVoteButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when button is clicked
    handleCardClick();
  };

  return (
    <div
      className="flex flex-col gap-4 bg-transparent border border-border rounded-lg p-4 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all duration-200"
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted overflow-hidden"></div>
          <div className="flex-1">
            <div className="font-medium">{insight.creator.name}</div>
            <div className="text-xs text-muted-foreground">{insight.created_at}</div>
          </div>
        </div>
        <Badge className={opinion === 'pros' ? 'bg-blue-600/10 text-blue-600 border-blue-600/20' : 'bg-red-600/10 text-red-600 border-red-600/20'}>{opinion === 'pros' ? '찬성' : '반대'}</Badge>
      </div>

      <p className="text-sm">{insight.content}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{insight.voted_count || 0} votes</span>
        </div>

        <Button
          variant="outline"
          className="text-xs"
          onClick={handleVoteButtonClick}
        >
          투표하기
        </Button>
      </div>
    </div>
  );
}