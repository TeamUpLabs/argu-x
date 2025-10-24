"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Comment, Debate, Insight } from "@/types/Debate";

interface SparringContextType {
  debate: Debate | undefined;
  isLoading: boolean;
  error: string | undefined;
  comments: Comment[];
  addComment: (content: string) => Promise<void>;
  deleteComment: (commentId: number) => Promise<void>;
  isAddingComment: boolean;
  isDeletingComment: boolean;
  insights: Insight[];
  isAddingInsight: boolean
  addInsight: (content: string, debate_side_id: number, argx: number) => Promise<void>;
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

  const [insights, setInsights] = useState<Insight[]>([]);
  const [isAddingInsight, setIsAddingInsight] = useState(false);

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

  const addInsight = useCallback(async (content: string, debate_side_id: number, argx: number) => {
    if (!debate || isAddingInsight) return
    
    setIsAddingInsight(true);
    try {
      const response = await fetch(`/api/debates/${debate.id}/insights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content: content,
          debate_side_id: debate_side_id,
          argx: argx,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add insight');
      }

      const newInsight = await response.json();
      const insightWithSide = {
        ...newInsight,
        side: debate_side_id === debate.pros.id ? 'pros' : 'cons' as 'pros' | 'cons',
        debate_side_id: debate_side_id
      };
      setInsights(prev => [...prev, insightWithSide]);
    } catch (error) {
      console.error('Error adding insight:', error);
      throw error;
    } finally {
      setIsAddingInsight(false);
    }
  }, [debate, isAddingInsight])

  // Update comments when debate changes
  useEffect(() => {
    if (debate?.comments) {
      setComments(debate.comments);
    }
  }, [debate?.comments]);

  // Update insights when debate changes
  useEffect(() => {
    if (debate?.pros?.insights || debate?.cons?.insights) {
      const prosInsights = (debate?.pros?.insights || []).map(insight => ({
        ...insight,
        side: 'pros' as const,
        debate_side_id: debate.pros.id
      }));
      const consInsights = (debate?.cons?.insights || []).map(insight => ({
        ...insight,
        side: 'cons' as const,
        debate_side_id: debate.cons.id
      }));
      setInsights([...prosInsights, ...consInsights]);
    }
  }, [debate?.pros?.insights, debate?.cons?.insights, debate?.pros?.id, debate?.cons?.id]);

  return (
    <SparringContext.Provider value={{ 
      debate, 
      isLoading, 
      error, 
      comments, 
      addComment, 
      deleteComment,
      isAddingComment,
      isDeletingComment,
      insights,
      isAddingInsight,
      addInsight
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
