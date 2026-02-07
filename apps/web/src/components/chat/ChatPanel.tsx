"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage as ChatMessageType } from "@/lib/types/chat";
import { ChatMessage } from "./ChatMessage";
import { ChatEmptyState } from "./ChatEmptyState";
import { ChatInput } from "./ChatInput";
import { ThinkingIndicator } from "./ThinkingIndicator";

interface ChatPanelProps {
  messages: ChatMessageType[];
  isThinking: boolean;
  onSendMessage: (content: string) => void;
  onTaskClick: (taskId: string) => void;
  onSuggestionClick: (suggestion: string) => void;
}

export function ChatPanel({
  messages,
  isThinking,
  onSendMessage,
  onTaskClick,
  onSuggestionClick,
}: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, isThinking]);

  return (
    <div className="flex h-full flex-col">
      {messages.length === 0 && !isThinking ? (
        <ChatEmptyState onSuggestionClick={onSuggestionClick} />
      ) : (
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
          <div className="space-y-3">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} onTaskClick={onTaskClick} />
            ))}
            {isThinking && <ThinkingIndicator />}
          </div>
        </div>
      )}
      <ChatInput onSubmit={onSendMessage} disabled={isThinking} />
    </div>
  );
}
