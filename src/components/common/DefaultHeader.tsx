"use client";

import Logo from "@/components/common/Logo";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import AuthButtons from "@/components/auth/AuthButtons";
import { Search, TrendingUp, CirclePlus, Flame, ChevronLeft, ChevronRight } from "lucide-react";
import ThemeToggle from "@/components/common/ThemeToggle";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Command, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator } from "@/components/ui/command";

interface Category {
  name: string;
  href: string;
  icon?: React.ReactNode;
}

const categories: Category[] = [
  {
    name: "Trending",
    href: "/",
    icon: <TrendingUp className="w-4 h-4" />
  },
  {
    name: "New",
    href: "/new",
    icon: <CirclePlus className="w-4 h-4" />
  },
  {
    name: "Hot",
    href: "/hot",
    icon: <Flame className="w-4 h-4" />
  },
  {
    name: "Politics",
    href: "/politics",
  },
  {
    name: "Sports",
    href: "/sports",
  },
  {
    name: "Entertainment",
    href: "/entertainment",
  },
  {
    name: "President",
    href: "/president",
  },
  {
    name: "Tech",
    href: "/tech",
  },
  {
    name: "World",
    href: "/world",
  },
  {
    name: "Education",
    href: "/education",
  },
  {
    name: "Economy",
    href: "/economy",
  },
  {
    name: "Health",
    href: "/health",
  },
  {
    name: "Style",
    href: "/style",
  },
  {
    name: "Travel",
    href: "/travel",
  },
  {
    name: "Food",
    href: "/food",
  },
  {
    name: "Beauty",
    href: "/beauty",
  },
  {
    name: "Elections",
    href: "/elections",
  },
]

export default function DefaultHeader({ fixed }: { fixed?: boolean }) {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const commandRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const checkScrollArrows = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchSelect = (value: string) => {
    const category = categories.find(cat => cat.name === value);
    if (category) {
      globalThis.location.href = category.href;
    }
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      isSearchOpen &&
      inputRef.current &&
      commandRef.current &&
      !inputRef.current.contains(event.target as Node) &&
      !commandRef.current.contains(event.target as Node)
    ) {
      setIsSearchOpen(false);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    checkScrollArrows();
    window.addEventListener('resize', checkScrollArrows);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('resize', checkScrollArrows);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen, handleClickOutside]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <header className={`w-full bg-background pt-4 pb-2 space-y-1 border-b ${fixed ? "sticky top-0 z-10" : ""}`}>
      <div className="flex items-center gap-4 max-w-7xl mx-auto">
        <Logo />
        <div className="flex flex-col gap-1 w-full relative">
          <InputGroup ref={inputRef} onClick={() => setIsSearchOpen(true)}>
            <InputGroupInput
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!isSearchOpen) setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
          {isSearchOpen && (
            <Command
              ref={commandRef}
              className="absolute top-full left-0 w-full z-50 bg-background border rounded-md shadow-lg mt-1 min-h-60 max-h-90 overflow-y-auto"
            >
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="BROWSE">
                  <CommandItem onSelect={() => handleSearchSelect("Trending")}>Trending</CommandItem>
                  <CommandItem onSelect={() => handleSearchSelect("New")}>New</CommandItem>
                  <CommandItem onSelect={() => handleSearchSelect("Hot")}>Hot</CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="TOPICS">
                  {(searchQuery ? filteredCategories : categories).slice(3, 8).map((category) => (
                    <CommandItem
                      key={category.name}
                      onSelect={() => handleSearchSelect(category.name)}
                    >
                      {category.icon}
                      {category.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          )}
        </div>
        <div className="flex items-center gap-2">
          <AuthButtons />
          <ThemeToggle />
        </div>
      </div>

      <nav className="relative max-w-7xl mx-auto">
        <div className="flex items-center gap-8 justify-between overflow-hidden overflow-x-auto scrollbar-hide" ref={scrollRef} onScroll={checkScrollArrows}>
          {categories.map((item) => {
            const isActive = pathname === item.href || pathname === item.href + '/';

            return (
              <Link href={item.href} key={item.name} className={`flex flex-1 items-center gap-2 py-1 hover:text-foreground text-sm text-center ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </div>

        {showLeftArrow && (
          <Button
            onClick={scrollLeft}
            variant="ghost"
            size="icon-sm"
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm shadow-md border rounded-full hover:bg-background cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        )}

        {showRightArrow && (
          <Button
            onClick={scrollRight}
            variant="ghost"
            size="icon-sm"
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm shadow-md border rounded-full hover:bg-background cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </nav>
    </header>
  );
}