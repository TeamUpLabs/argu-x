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
  opinionType: 'pros' | 'cons';
  setOpinionType: (type: 'pros' | 'cons') => void;
}

export default function Filter({ opinionType, setOpinionType }: FilterProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {opinionType === 'pros' ? '찬성 의견' : '반대 의견'}
          <ChevronUp className={cn("opacity-50 transition-all duration-200 ease-in-out", open ? "rotate-0" : "rotate-180")} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpinionType('pros');
                  setOpen(false);
                }}
              >
                찬성 의견
                <Check className={opinionType === 'pros' ? 'mr-2 h-4 w-4' : 'mr-2 h-4 w-4 opacity-0'} />
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  setOpinionType('cons');
                  setOpen(false);
                }}
              >
                반대 의견 
                <Check className={opinionType === 'cons' ? 'mr-2 h-4 w-4' : 'mr-2 h-4 w-4 opacity-0'} />
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}