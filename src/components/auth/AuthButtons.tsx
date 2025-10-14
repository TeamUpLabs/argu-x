import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/userStore";
import { useState } from "react";
import SigninDialog from "./SigninDialog";
import SignupDialog from "./SignupDialog";
import Image from "next/image";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

export default function AuthButtons() {
  const { isAuthenticated, user, logout } = useUserStore();
  const [isLogin, setIsLogin] = useState<boolean | undefined>();

  return (
    <>
      <div className="flex items-center gap-2">
        {isAuthenticated() ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center cursor-pointer">
                <Image
                  src={user?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'}
                  alt={user?.name || user?.email || 'U'}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                {user?.name || user?.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>
                <Button variant="ghost" onClick={logout} className="w-full">
                  로그아웃
                </Button>
              </DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Button variant="ghost" onClick={() => setIsLogin(true)}>Sign In</Button>
            <Button variant="default" onClick={() => setIsLogin(false)}>Sign Up</Button>
          </>
        )}
      </div>

      <SigninDialog isLogin={isLogin} setIsLogin={setIsLogin} />
      <SignupDialog isLogin={isLogin} setIsLogin={setIsLogin} />
    </>
  );
}