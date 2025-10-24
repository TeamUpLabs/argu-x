"use client";

import { createContext, useContext } from "react";
import { Debate } from "@/types/Debate";

interface SparringContextType {
  debate: Debate | undefined;
  isLoading: boolean;
  error: string | undefined;
}

const SparringContext = createContext<SparringContextType | undefined>(undefined);

interface SparringProviderProps {
  children: React.ReactNode;
  debate: Debate | undefined;
  isLoading: boolean;
  error: string | undefined;
}

export const SparringProvider = ({ children, debate, isLoading, error }: SparringProviderProps) => {
  return (
    <SparringContext.Provider value={{ debate, isLoading, error }}>
      {children}
    </SparringContext.Provider>
  );
};

export const useSparringContext = () => {
  const context = useContext(SparringContext);
  if (!context) {
    throw new Error('useSparringContext must be used within a SparringProvider');
  }
  return context;
};
