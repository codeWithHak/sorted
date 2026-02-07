"use client";

import { useState, useEffect, useCallback } from "react";
import type { ChatMessage } from "@/lib/types/chat";
import { loadMessages, saveMessages, clearMessages } from "@/lib/chat-storage";
import { getMockJettResponse } from "@/lib/mock/jett-responses";

export function useChat(userId: string | undefined) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setMessages(loadMessages(userId));
  }, [userId]);

  useEffect(() => {
    if (!userId || messages.length === 0) return;
    saveMessages(userId, messages);
  }, [userId, messages]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!userId) return;

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

      try {
        const jettResponse = await getMockJettResponse(content);
        setMessages((prev) => [...prev, jettResponse]);
      } finally {
        setIsThinking(false);
      }
    },
    [userId],
  );

  const clearHistory = useCallback(() => {
    if (!userId) return;
    setMessages([]);
    clearMessages(userId);
  }, [userId]);

  return { messages, sendMessage, isThinking, clearHistory };
}
