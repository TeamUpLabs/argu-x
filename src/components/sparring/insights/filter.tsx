import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils";
import { useState } from "react";

interface FilterProps {
  sortType: 'latest' | 'popular';
  setSortType: (type: 'latest' | 'popular') => void;
}

export default function Filter({ sortType, setSortType }: FilterProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {sortType === 'latest' ? '최신순' : '인기순'}
          <ChevronUp className={cn("opacity-50 transition-all duration-200 ease-in-out", open ? "rotate-0" : "rotate-180")} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setSortType('latest');
                  setOpen(false);
                }}
              >
                최신순
                <Check className={sortType === 'latest' ? 'mr-2 h-4 w-4' : 'mr-2 h-4 w-4 opacity-0'} />
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  setSortType('popular');
                  setOpen(false);
                }}
              >
                인기순
                <Check className={sortType === 'popular' ? 'mr-2 h-4 w-4' : 'mr-2 h-4 w-4 opacity-0'} />
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}