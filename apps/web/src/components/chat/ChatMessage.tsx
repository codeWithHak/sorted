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
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
          J
        </div>
      )}
      <div
        className={`max-w-[80%] ${
          isUser
            ? "rounded-xl rounded-br-sm bg-stone-100 px-3 py-2"
            : "rounded-xl rounded-tl-sm border-l-2 border-amber-200 bg-white px-3 py-2"
        }`}
      >
        <p className="text-sm text-stone-700 whitespace-pre-wrap">{message.content}</p>
        {message.actionCard && onTaskClick && (
          <ActionCard
            actionType={message.actionCard.actionType}
            taskCount={message.actionCard.taskCount}
            tasks={message.actionCard.tasks}
            onTaskClick={onTaskClick}
          />
        )}
        <p className="mt-1 text-[10px] text-stone-400">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}
