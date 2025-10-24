"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Comment, Debate } from "@/types/Debate";

interface SparringContextType {
  debate: Debate | undefined;
  isLoading: boolean;
  error: string | undefined;
  comments: Comment[];
  addComment: (content: string) => Promise<void>;
  deleteComment: (commentId: number) => Promise<void>;
  isAddingComment: boolean;
  isDeletingComment: boolean;
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
  const [isDeletingComment, setIsDeletingComment] = useState(false);

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

  const deleteComment = useCallback(async (commentId: number) => {
    if (!debate) return;

    setIsDeletingComment(true);
    try {
      const response = await fetch(`/api/debates/${debate.id}/comments`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          comment_id: commentId,
          debate_id: debate.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    } finally {
      setIsDeletingComment(false);
    }
  }, [debate]);

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
      deleteComment,
      isAddingComment,
      isDeletingComment 
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
