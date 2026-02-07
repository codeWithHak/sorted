import type { ChatMessage } from "@/lib/types/chat";

const MAX_MESSAGES = 200;

function getKey(userId: string): string {
  return `sorted-chat-${userId}`;
}

export function loadMessages(userId: string): ChatMessage[] {
  try {
    const raw = localStorage.getItem(getKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveMessages(userId: string, messages: ChatMessage[]): void {
  try {
    const trimmed = messages.slice(-MAX_MESSAGES);
    localStorage.setItem(getKey(userId), JSON.stringify(trimmed));
  } catch {
    // localStorage full or unavailable
  }
}

export function clearMessages(userId: string): void {
  try {
    localStorage.removeItem(getKey(userId));
  } catch {
    // ignore
  }
}
