import Image from "next/image";
import type { ChatMessage as ChatMessageType } from "@/lib/types/chat";
import { ActionCard } from "./ActionCard";

interface ChatMessageProps {
  message: ChatMessageType;
  onTaskClick?: (taskId: string) => void;
}

export function ChatMessage({ message, onTaskClick }: ChatMessageProps) {
  const isUser = message.sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "gap-2"}`}>
      {!isUser && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden shadow-[0_0_12px_rgba(5,150,105,0.3)]">
          <Image src="/jett.jpg" alt="Jett" width={28} height={28} className="h-full w-full object-cover" />
        </div>
      )}
      <div
        className={`max-w-[80%] ${
          isUser
            ? "bg-white/10 px-3 py-2"
            : "border-l-2 border-emerald-600/30 bg-white/5 px-3 py-2"
        }`}
      >
        <p className="text-sm text-white/80 whitespace-pre-wrap">{message.content}</p>
        {message.actionCard && onTaskClick && (
          <ActionCard
            actionType={message.actionCard.actionType}
            taskCount={message.actionCard.taskCount}
            tasks={message.actionCard.tasks}
            onTaskClick={onTaskClick}
          />
        )}
        <p className="mt-1 text-[10px] text-white/20">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}
