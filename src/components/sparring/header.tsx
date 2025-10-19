
import { Debate } from "@/types/Debate";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";
import { Bookmark } from "lucide-react";

interface HeaderProps {
  debate?: Debate;
  scale: number;
  opacity: number;
}

export default function Header({ scale, debate, opacity }: HeaderProps) {
  return (
    <div className="flex items-center justify-between sticky top-[101px] bg-background z-10 pt-4 pb-1">
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
            <div className="flex flex-col">
              <span className="text-foreground font-bold text-2xl">{debate.title}</span>
              <span className="text-muted-foreground text-xs">{debate.cons.count + debate.pros.count}명 투표완료</span>
            </div>
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
  );
}