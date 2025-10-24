"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Comment, Debate } from "@/types/Debate";

interface SparringContextType {
  debate: Debate | undefined;
  isLoading: boolean;
  error: string | undefined;
  comments: Comment[];
  addComment: (content: string) => Promise<void>;
  isAddingComment: boolean;
}

const SparringContext = createContext<SparringContextType | undefined>(undefined);

interface SparringProviderProps {
  children: React.ReactNode;
  debate: Debate | undefined;
  isLoading: boolean;
  error: string | undefined;
}

export const SparringProvider = ({ children, debate, isLoading, error }: SparringProviderProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isAddingComment, setIsAddingComment] = useState(false);

  const addComment = useCallback(async (content: string) => {
    if (!debate || isAddingComment) return;

    setIsAddingComment(true);
    try {
      const response = await fetch(`/api/debates/${debate.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content,
          debate_id: debate.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const newComment = await response.json();
      setComments(prev => [...prev, newComment]);
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    } finally {
      setIsAddingComment(false);
    }
  }, [debate, isAddingComment]);

  // Update comments when debate changes
  useEffect(() => {
    if (debate?.comments) {
      setComments(debate.comments);
    }
  }, [debate?.comments]);

  return (
    <SparringContext.Provider value={{ 
      debate, 
      isLoading, 
      error, 
      comments, 
      addComment, 
      isAddingComment 
    }}>
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
