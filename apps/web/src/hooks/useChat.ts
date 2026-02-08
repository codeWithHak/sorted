"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { ChatMessage, ActionCardData } from "@/lib/types/chat";
import { authClient } from "@/lib/auth-client";
import { streamChat, type SSEEvent } from "@/lib/sse-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface UseChatOptions {
  onTaskAction?: () => void;
}

export function useChat(userId: string | undefined, options?: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // Load most recent thread on mount
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    async function loadHistory() {
      setIsLoading(true);
      try {
        const { data: tokenData } = await authClient.token();
        if (!tokenData?.token || cancelled) return;

        const res = await fetch(`${API_BASE_URL}/chat/threads?per_page=1`, {
          headers: { Authorization: `Bearer ${tokenData.token}` },
        });
        if (!res.ok || cancelled) return;

        const threads = await res.json();
        if (threads.data.length === 0 || cancelled) return;

        const latestThread = threads.data[0];
        setThreadId(latestThread.id);

        const msgRes = await fetch(
          `${API_BASE_URL}/chat/threads/${latestThread.id}/messages?per_page=100`,
          { headers: { Authorization: `Bearer ${tokenData.token}` } },
        );
        if (!msgRes.ok || cancelled) return;

        const msgData = await msgRes.json();
        const loaded: ChatMessage[] = msgData.data.map(
          (m: { id: string; role: string; content: string; action_card: unknown; created_at: string }) => ({
            id: m.id,
            sender: m.role === "user" ? "user" : "agent",
            agentId: m.role === "assistant" ? "jett" : null,
            content: m.content,
            timestamp: m.created_at,
            actionCard: m.action_card as ActionCardData | null,
          }),
        );
        if (!cancelled) setMessages(loaded);
      } catch {
        // Silently fail — user can still start a new conversation
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadHistory();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!userId) return;

      const { data: tokenData, error } = await authClient.token();
      if (error || !tokenData?.token) return;

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        sender: "user",
        agentId: null,
        content,
        timestamp: new Date().toISOString(),
        actionCard: null,
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsThinking(true);

      // Prepare a placeholder for the agent response
      const agentMessageId = crypto.randomUUID();
      let agentContent = "";
      let actionCard: ActionCardData | null = null;
      let currentThreadId = threadId;

      const abortController = new AbortController();
      abortRef.current = abortController;

      try {
        for await (const event of streamChat(
          content,
          currentThreadId,
          tokenData.token,
          abortController.signal,
        )) {
          switch (event.type) {
            case "stream_start":
              currentThreadId = event.thread_id;
              setThreadId(event.thread_id);
              setIsThinking(false);
              // Add empty agent message that will be built up
              setMessages((prev) => [
                ...prev,
                {
                  id: agentMessageId,
                  sender: "agent",
                  agentId: "jett",
                  content: "",
                  timestamp: event.timestamp,
                  actionCard: null,
                },
              ]);
              break;

            case "text_token":
              agentContent += event.token;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === agentMessageId ? { ...m, content: agentContent } : m,
                ),
              );
              break;

            case "task_action":
              // Accumulate tasks into the action card (don't replace)
              if (actionCard && actionCard.actionType === event.action_type) {
                actionCard = {
                  ...actionCard,
                  taskCount: actionCard.taskCount + 1,
                  tasks: [...actionCard.tasks, { id: event.task_id, title: event.task_title }],
                };
              } else {
                actionCard = {
                  actionType: event.action_type,
                  taskCount: 1,
                  tasks: [{ id: event.task_id, title: event.task_title }],
                };
              }
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === agentMessageId ? { ...m, actionCard } : m,
                ),
              );
              // Trigger task panel refresh
              options?.onTaskAction?.();
              break;

            case "processing_status":
              // Update agent message with status
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === agentMessageId ? { ...m, content: event.status } : m,
                ),
              );
              break;

            case "stream_end":
              // Finalize the message with full text
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === agentMessageId
                    ? { ...m, content: event.full_text || agentContent }
                    : m,
                ),
              );
              break;

            case "error":
              setIsThinking(false);
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === agentMessageId
                    ? {
                        ...m,
                        content: event.retryable
                          ? "Please try again in a moment."
                          : event.message,
                      }
                    : m,
                ),
              );
              break;
          }
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setMessages((prev) => [
            ...prev.filter((m) => m.id !== agentMessageId),
            {
              id: agentMessageId,
              sender: "agent",
              agentId: "jett",
              content: "Connection lost. Please check your internet.",
              timestamp: new Date().toISOString(),
              actionCard: null,
            },
          ]);
        }
      } finally {
        setIsThinking(false);
        abortRef.current = null;
      }
    },
    [userId, threadId, options],
  );

  const clearHistory = useCallback(() => {
    setMessages([]);
    setThreadId(null);
  }, []);

  return { messages, sendMessage, isThinking, clearHistory, isLoading, threadId };
}
