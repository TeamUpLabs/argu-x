import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { useEffect } from "react";

type State = {
  Token: string | undefined;
  user: {
    email: string;
    name?: string;
    avatar?: string;
    argx?: number;
  } | undefined;
  isAuthenticated: () => boolean;
  debug: () => { token: string | undefined; isAuth: boolean };
  _hasHydrated: boolean;
}

type Action = {
  setToken: (token: string) => void;
  setUser: (user: { email: string; name?: string; avatar?: string; argx?: number }) => void;
  logout: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useUserStore = create<State & Action>()(
  devtools(
    persist(
      (set, get) => ({
        Token: undefined,
        user: undefined,
        _hasHydrated: false,
        setToken: (token: string) => set({ Token: token }),
        setUser: (user: { email: string; name?: string; avatar?: string }) => set({ user }),
        logout: () => set({ Token: undefined, user: undefined }),
        isAuthenticated: () => {
          const token = get().Token;
          return !!token;
        },
        debug: () => {
          const token = get().Token;
          return { token, isAuth: !!token };
        },
        setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
      }),
      {
        name: "user-storage",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);

// 클라이언트 사이드에서만 실행되는 하이드레이션 완료 훅
export function useHydration() {
  const setHasHydrated = useUserStore((state) => state.setHasHydrated);
  
  useEffect(() => {
    setHasHydrated(true);
  }, [setHasHydrated]);
}