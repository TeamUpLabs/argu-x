import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/userStore";

export default function AuthButtons() {
  const { isAuthenticated } = useUserStore();

  return (
    <div className="flex items-center gap-2">
      {isAuthenticated() ? (
        <div className="w-10 h-10 rounded-full bg-muted">
        </div>
      ) : (
        <>
          <Button variant="ghost">Sign In</Button>
          <Button variant="default">Sign Up</Button>
        </>
      )}
    </div>
  );
}