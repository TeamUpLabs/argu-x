import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/userStore";
import { useState } from "react";
import SigninDialog from "./SigninDialog";
import SignupDialog from "./SignupDialog";
import Image from "next/image";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { useHydration } from "@/store/userStore";

export default function AuthButtons() {
  const { isAuthenticated, user, logout } = useUserStore();
  const [isLogin, setIsLogin] = useState<boolean | undefined>();
  const { _hasHydrated } = useUserStore();

  // 하이드레이션이 완료될 때까지 인증 상태를 표시하지 않음
  useHydration();

  // 하이드레이션이 완료되지 않으면 빈 공간을 반환
  if (!_hasHydrated) {
    return <div className="flex items-center gap-2"></div>;
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {isAuthenticated() ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-10 h-10 rounded-full bg-muted flex items-center justify-center cursor-pointer border-none bg-transparent p-0">
                <Image
                  src={user?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'}
                  alt={user?.name || user?.email || 'U'}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                {user?.name || user?.email}
              </DropdownMenuLabel>
              <DropdownMenuLabel className="float-right">
                {user?.argx || 0} ARGX
              </DropdownMenuLabel>
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