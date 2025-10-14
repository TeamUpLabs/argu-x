import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/userStore";
import { useState } from "react";
import SigninDialog from "./SigninDialog";
import SignupDialog from "./SignupDialog";

export default function AuthButtons() {
  const { isAuthenticated } = useUserStore();
  const [isLogin, setIsLogin] = useState<boolean | undefined>();

  return (
    <>
      <div className="flex items-center gap-2">
        {isAuthenticated() ? (
          <div className="w-10 h-10 rounded-full bg-muted">
          </div>
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