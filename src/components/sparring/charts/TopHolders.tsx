import Image from "next/image";
import { TopHolder } from "@/types/Debate";

interface TopHoldersProps {
  top_holder: TopHolder;
}

export default function TopHolders({ top_holder }: TopHoldersProps) {
  return (
    <div className="flex items-center justify-between p-2">
      <div className="flex items-center gap-2">
        <div className="bg-muted w-11 h-11 rounded-full">
          <Image
            src={top_holder.user.avatar}
            alt={top_holder.user.name}
            width={44}
            height={44}
            className="rounded-full"
          />
        </div>
        <span className="text-foreground font-semibold text-sm">{top_holder.user.name}</span>
      </div>
      <span className="text-foreground font-semibold text-sm">{top_holder.total_argx} ARGX</span>
    </div>
  );
}