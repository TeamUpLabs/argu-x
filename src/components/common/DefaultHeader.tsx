"use client";

import Logo from "@/components/common/Logo";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import AuthButtons from "@/components/common/AuthButtons";
import { Search, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import ThemeToggle from "@/components/common/ThemeToggle";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface Category {
  name: string;
  href: string;
  icon?: React.ReactNode;
}

const categories: Category[] = [
  {
    name: "Trending",
    href: "/",
    icon: <TrendingUp />
  },
  {
    name: "New",
    href: "/new",
  },
  {
    name: "Hot",
    href: "/hot",
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

export default function DefaultHeader() {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScrollArrows = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollArrows();
    window.addEventListener('resize', checkScrollArrows);
    return () => window.removeEventListener('resize', checkScrollArrows);
  }, []);

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
    <header className="w-full">
      <div className="flex items-center gap-4 px-4 lg:px-6 py-4 pb-1 max-w-7xl mx-auto">
        <Logo />
        <InputGroup>
          <InputGroupInput placeholder="Search..." />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
        <div className="flex items-center gap-2">
          <AuthButtons />
          <ThemeToggle />
        </div>
      </div>

      <nav className="relative max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide" ref={scrollRef} onScroll={checkScrollArrows}>
          {categories.map((item) => {
            const isActive = pathname === item.href || pathname === item.href + '/';

            return (
              <Link href={item.href} key={item.name} className={`flex items-center gap-2 px-2.5 py-1 hover:text-foreground flex-1 text-center ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
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