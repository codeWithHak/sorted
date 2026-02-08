/**
 * SSE client for streaming chat responses from the AI agent.
 *
 * Uses fetch + ReadableStream (not EventSource) because:
 * - The chat endpoint is POST-based (sends message body)
 * - EventSource only supports GET requests
 * - We need custom Authorization headers
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface StreamStartEvent {
  type: "stream_start";
  thread_id: string;
  message_id: string;
  timestamp: string;
}

export interface TextTokenEvent {
  type: "text_token";
  token: string;
  index: number;
}

export interface TaskActionEvent {
  type: "task_action";
  action_type: "created" | "updated" | "completed" | "deleted";
  task_id: string;
  task_title: string;
  task_count: number;
}

export interface StreamEndEvent {
  type: "stream_end";
  message_id: string;
  finish_reason: "stop" | "error" | "max_tokens";
  full_text: string;
}

export interface SSEErrorEvent {
  type: "error";
  code: string;
  message: string;
  retryable: boolean;
}

export type SSEEvent =
  | StreamStartEvent
  | TextTokenEvent
  | TaskActionEvent
  | StreamEndEvent
  | SSEErrorEvent;

function parseSSELine(eventType: string, data: string): SSEEvent | null {
  try {
    const parsed = JSON.parse(data);
    switch (eventType) {
      case "stream_start":
        return { type: "stream_start", ...parsed };
      case "text_token":
        return { type: "text_token", ...parsed };
      case "task_action":
        return { type: "task_action", ...parsed };
      case "stream_end":
        return { type: "stream_end", ...parsed };
      case "error":
        return { type: "error", ...parsed };
      default:
        return null;
    }
  } catch {
    return null;
  }
}

export async function* streamChat(
  message: string,
  threadId: string | null,
  token: string,
  signal?: AbortSignal,
): AsyncGenerator<SSEEvent> {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      message,
      thread_id: threadId,
    }),
    signal,
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "Unknown error");
    yield {
      type: "error",
      code: `HTTP_${response.status}`,
      message:
        response.status === 401
          ? "Your session has expired. Please log in again."
          : "Something went wrong. Please try again.",
      retryable: response.status !== 401,
    };
    return;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    yield {
      type: "error",
      code: "NO_STREAM",
      message: "Unable to read response stream.",
      retryable: true,
    };
    return;
  }

  const decoder = new TextDecoder();
  let buffer = "";
  let currentEvent = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      // Keep the last (potentially incomplete) line in the buffer
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (line.startsWith("event: ")) {
          currentEvent = line.slice(7).trim();
        } else if (line.startsWith("data: ") && currentEvent) {
          const data = line.slice(6);
          const event = parseSSELine(currentEvent, data);
          if (event) {
            yield event;
          }
          currentEvent = "";
        }
        // Empty lines and comments are ignored
      }
    }

    // Process any remaining data in the buffer
    if (buffer.trim()) {
      const lines = buffer.split("\n");
      for (const line of lines) {
        if (line.startsWith("event: ")) {
          currentEvent = line.slice(7).trim();
        } else if (line.startsWith("data: ") && currentEvent) {
          const data = line.slice(6);
          const event = parseSSELine(currentEvent, data);
          if (event) {
            yield event;
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
