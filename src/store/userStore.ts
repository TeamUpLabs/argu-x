import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

type State = {
  Token: string | undefined;
  user: {
    email: string;
    name?: string;
    avatar?: string;
  } | undefined;
  isAuthenticated: () => boolean;
  debug: () => { token: string | undefined; isAuth: boolean };
}

type Action = {
  setToken: (token: string) => void;
  setUser: (user: { email: string; name?: string; avatar?: string }) => void;
  logout: () => void;
}

export const useUserStore = create<State & Action>()(
  devtools(
    persist(
      (set, get) => ({
        Token: undefined,
        user: undefined,
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
      }),
      {
        name: "user-storage",
        storage: createJSONStorage(() => localStorage),
        skipHydration: true, // 서버사이드에서 hydration을 건너뜁니다
      }
    )
  )
)