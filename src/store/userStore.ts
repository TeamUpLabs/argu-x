"use client";

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
  updateUserArgx: (argx: number) => void;
  logout: () => Promise<void>;
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
        setUser: (user: { email: string; name?: string; avatar?: string; argx?: number }) => set({ user }),
        updateUserArgx: (argx: number) => set((state) => ({
          user: state.user ? { ...state.user, argx } : undefined
        })),
        logout: async () => {
          try {
            await fetch("/api/login", { method: "DELETE" });
          } catch (error) {
            console.error("Logout API call failed:", error);
          }
          set({ Token: undefined, user: undefined });
        },
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
        storage: createJSONStorage(() => ({
          getItem: (name: string) => {
            if (globalThis.window === undefined) return null;

            // Try to get token from cookie first
            const cookies = document.cookie.split(";").map(c => c.trim());
            const tokenCookie = cookies.find(c => c.startsWith("token="));
            if (tokenCookie) {
              const token = tokenCookie.split("=")[1];
              return JSON.stringify({ state: { Token: token }, version: 0 });
            }

            return localStorage.getItem(name);
          },
          setItem: (name: string, value: string) => {
            localStorage.setItem(name, value);
          },
          removeItem: (name: string) => {
            localStorage.removeItem(name);
          },
        })),
      }
    )
  )
);

// 클라이언트 사이드에서만 실행되는 하이드레이션 완료 훅
export function useHydration() {
  const setHasHydrated = useUserStore((state) => state.setHasHydrated);

  useEffect(() => {
    // Sync token from cookie to store on mount
    const cookies = document.cookie.split(";").map(c => c.trim());
    const tokenCookie = cookies.find(c => c.startsWith("token="));
    if (tokenCookie) {
      const token = tokenCookie.split("=")[1];
      useUserStore.getState().setToken(token);
    }

    setHasHydrated(true);
  }, [setHasHydrated]);
}