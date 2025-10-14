"use client";

import Logo from "@/components/common/Logo";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import AuthButtons from "@/components/common/AuthButtons";
import { Search } from "lucide-react";
import ThemeToggle from "@/components/common/ThemeToggle";

export default function Header() {
  return (
    <header className="w-full border-b">
      <div className="flex items-center gap-4 p-4 max-w-7xl mx-auto">
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
    </header>
  );
}