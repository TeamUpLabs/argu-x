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
  chartType: 'participation' | 'opinion';
  setChartType: (type: 'participation' | 'opinion') => void;
}

export default function Filter({ chartType, setChartType }: FilterProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {chartType === 'participation' ? '참여 추이' : '의견 분포'}
          <ChevronUp className={cn("opacity-50 transition-all duration-200 ease-in-out", open ? "rotate-0" : "rotate-180")} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setChartType('participation');
                  setOpen(false);
                }}
              >
                참여 추이
                <Check className={chartType === 'participation' ? 'mr-2 h-4 w-4' : 'mr-2 h-4 w-4 opacity-0'} />
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  setChartType('opinion');
                  setOpen(false);
                }}
              >
                의견 분포
                <Check className={chartType === 'opinion' ? 'mr-2 h-4 w-4' : 'mr-2 h-4 w-4 opacity-0'} />
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}