import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

type State = {
  Token: string | undefined;
  isAuthenticated: () => boolean;
}

type Action = {
  setToken: (token: string) => void;
}

export const useUserStore = create<State & Action>()(
  devtools(
    persist(
      (set, get) => ({
        Token: undefined,
        setToken: (token: string) => set({ Token: token }),
        isAuthenticated: () => !!get().Token,
      }),
      {
        name: "user-storage",
        storage: createJSONStorage(() => ({
          getItem: (key: string) => localStorage.getItem(key),
          setItem: (key: string, value: string) => localStorage.setItem(key, value),
          removeItem: (key: string) => localStorage.removeItem(key),
        })),
      }
    )
  )
)