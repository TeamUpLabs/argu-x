"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useUserStore } from "@/store/userStore";
import { Debate } from "@/types/Debate";

interface VoteResponse {
  success?: boolean;
  message?: string;
  error?: string;
  insight_id?: number;
  debate_id?: number;
  argx?: number;
}

interface SparringContextType {
  debate: Debate | undefined;
  isLoading: boolean;
  error: string | undefined;
  addComment: (content: string) => Promise<void>;
  deleteComment: (commentId: number) => Promise<void>;
  addInsight: (content: string, debate_side_id: number, argx: number) => Promise<void>;
  voteInsight: (insightId: number, argx: number) => Promise<VoteResponse | string>;
  isAddingComment: boolean;
  isDeletingComment: boolean;
  isAddingInsight: boolean;
  isAlreadyVoted: boolean;
  setIsAlreadyVoted: (value: boolean) => void;
}

const SparringContext = createContext<SparringContextType | undefined>(undefined);

interface SparringProviderProps {
  children: React.ReactNode;
  initialDebate: Debate | undefined;
}

export const SparringProvider = ({ children, initialDebate }: SparringProviderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>("");
  const token = useUserStore.getState().Token;
  const [debate, setDebate] = useState<Debate | undefined>(initialDebate);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [isDeletingComment, setIsDeletingComment] = useState(false);
  const [isAddingInsight, setIsAddingInsight] = useState(false);
  const [isAlreadyVoted, setIsAlreadyVoted] = useState(false);

  const webSocketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [currentDebateId, setCurrentDebateId] = useState<number | undefined>(initialDebate?.id);

  const connectWebSocket = useCallback(() => {
    if (!currentDebateId || !token) return;

    // 기존 연결이 있으면 닫기
    if (webSocketRef.current) {
      webSocketRef.current.close();
    }

    // WebSocket 연결 전 500ms 딜레이
    const connectWithDelay = () => {
      try {
        const webSocket = new WebSocket(`ws://localhost:8000/api/v1/ws/debates/${currentDebateId}?token=${token}`);
        webSocketRef.current = webSocket;

        webSocket.addEventListener('open', () => {
          console.log('WebSocket connected');
          setIsLoading(false);
          setError(undefined);
        });

        webSocket.addEventListener('message', (event) => {
          try {
            const messageData = JSON.parse(event.data as string);
            console.log('WebSocket message received:', messageData);

            // debate 업데이트 메시지인 경우 상태 업데이트
            if (messageData && typeof messageData === 'object' && 'id' in messageData) {
              setDebate(messageData as Debate);
            }
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        });

        webSocket.addEventListener('error', (error) => {
          console.error('WebSocket error:', error);
          setError('WebSocket connection failed. Please refresh the page.');
          setIsLoading(false);
        });

        webSocket.addEventListener('close', (event) => {
          console.log('WebSocket closed:', event.code, event.reason);
          setIsLoading(false);

          // 정상적인 종료가 아닌 경우 재연결 시도
          if (event.code !== 1000 && currentDebateId && token) {
            console.log('Attempting to reconnect...');
            reconnectTimeoutRef.current = setTimeout(() => {
              connectWebSocket();
            }, 3000);
          }
        });

      } catch (error) {
        console.error('Failed to create WebSocket connection:', error);
        setError('Failed to establish WebSocket connection');
        setIsLoading(false);
      }
    };

    // 500ms 딜레이 후 연결
    setTimeout(connectWithDelay, 50);
  }, [currentDebateId, token]);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close(1000, 'Component unmounting');
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connectWebSocket]);

  // debate가 변경될 때 currentDebateId 업데이트
  useEffect(() => {
    if (initialDebate?.id && initialDebate.id !== currentDebateId) {
      setCurrentDebateId(initialDebate.id);
    }
    if (initialDebate) {
      setDebate(initialDebate);
    }
  }, [initialDebate, currentDebateId]);

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
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    } finally {
      setIsAddingComment(false);
    }
  }, [debate, isAddingComment]);

  const deleteComment = useCallback(async (commentId: number) => {
    if (!debate || isDeletingComment) return;

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
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    } finally {
      setIsDeletingComment(false);
    }
  }, [debate, isDeletingComment]);

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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add insight');
      }

      // Successfully added insight - API returned success
      console.log('Successfully added insight:', data);
      return data;

    } catch (error) {
      console.error('Error adding insight:', error);
      throw error;
    } finally {
      setIsAddingInsight(false);
    }
  }, [debate, isAddingInsight])

  const voteInsight = useCallback(async (insightId: number, argx: number) => {
    if (!debate || isAddingInsight) {
      throw new Error('Cannot vote: debate not available or another operation in progress');
    }

    setIsAddingInsight(true);
    try {
      const response = await fetch(`/api/debates/${debate.id}/insights/${insightId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          insight_id: insightId,
          argx: argx,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "already voted on this insight") {
          setIsAlreadyVoted(true);
          return "already voted"
        }
        throw new Error(data.error || 'Failed to vote insight');
      }

      // Successfully voted - API returned success
      console.log('Successfully voted on insight:', data);

      // Check if the response indicates already voted (some APIs might return success with a message)
      if (data.error === "already voted on this insight" ||
          data.message?.includes("already voted") ||
          data.message?.includes("이미 투표")) {
        setIsAlreadyVoted(true);
        return "already voted";
      }

      return data;

    } catch (error) {
      console.error('Error voting insight:', error);
      throw error;
    } finally {
      setIsAddingInsight(false);
    }
  }, [debate, isAddingInsight])

  return (
    <SparringContext.Provider value={{
      debate,
      isLoading,
      error,
      addComment,
      deleteComment,
      addInsight,
      isAddingComment,
      isDeletingComment,
      isAddingInsight,
      voteInsight,
      isAlreadyVoted,
      setIsAlreadyVoted
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
