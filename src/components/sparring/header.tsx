import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare, Clock } from "lucide-react";
import { Debate } from "@/types/Debate";

interface HeaderProps {
  debate?: Debate;
  scale: number;
  opacity: number;
}

export default function Header({ scale, debate, opacity }: HeaderProps) {
  return (
    <div className="sticky top-[101px] bg-background z-2 pt-4 pb-1" style={{ height: `${Math.max(80, 150 * scale)}px` }}>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 origin-center origin-top-left" style={{ transform: `scale(${scale})` }}>
          <div className="flex items-center gap-2">
            <Badge
              variant="default"
            >
              {debate?.category}
            </Badge>
            <Badge
              variant="outline"
            >
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
              {debate?.status}
            </Badge>
          </div>
          <div className="flex flex-col">
            <span className="text-foreground font-bold text-2xl">{debate?.title}</span>
            <span className="text-muted-foreground text-sm">{debate?.description}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Users size={12} className="text-muted-foreground" />
              <span className="text-muted-foreground text-xs">{(debate?.cons?.insights.reduce((acc, insight) => acc + insight.voted_count, 0) || 0) + (debate?.pros?.insights.reduce((acc, insight) => acc + insight.voted_count, 0) || 0)} participants</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare size={12} className="text-muted-foreground" />
              <span className="text-muted-foreground text-xs">{(debate?.pros?.count || 0) + (debate?.cons?.count || 0)} insights</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={12} className="text-muted-foreground" />
              <span className="text-muted-foreground text-xs">2h 34m remaining</span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-px absolute bottom-0 left-0 bg-border" style={{ opacity: 1 - opacity }}></div>
    </div>
  );
}