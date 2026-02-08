# Research: AI-Powered Todo Chatbot

**Feature**: 009-ai-todo-chatbot
**Date**: 2026-02-08

## Decision 1: AI Agent Framework

**Decision**: OpenAI Agents SDK (`openai-agents` package, import as `agents`)

**Rationale**: Constitution mandates OpenAI Agents SDK for Phase III. Provides Agent class with system prompt, function tools via `@function_tool`, streaming via `Runner.run_streamed()`, context injection via `RunContextWrapper[T]`, and built-in guardrails (`@input_guardrail`, `@output_guardrail`).

**Alternatives considered**:
- LangChain/LangGraph: More complex, heavier dependency, not specified in constitution
- Raw OpenAI API: No agent abstraction, manual tool loop, no guardrails
- Anthropic Claude: Different provider, not specified in constitution

**Key patterns**:
- `Agent(name, instructions, model, tools, input_guardrails, output_guardrails)`
- `Runner.run_streamed(agent, input=messages, context=ctx)` returns `RunResultStreaming` (not awaited)
- Iterate `result.stream_events()` for `RawResponsesStreamEvent` (text deltas) and `RunItemStreamEvent` (tool calls)
- `RunContextWrapper[ChatContext]` as first param in tools — auto-injected, hidden from LLM schema
- Tool functions must return `str`; parameters must be JSON-serializable types
- Install: `uv add openai-agents`

## Decision 2: MCP Server Approach

**Decision**: FastMCP in-process with OpenAI Agents SDK function_tool (not separate MCP transport)

**Rationale**: The spec says the MCP server runs as a Python module within the services/api package. However, the OpenAI Agents SDK uses `@function_tool` for tool registration, not MCP protocol directly. The practical approach is: define tools as `@function_tool` decorated functions that the agent calls directly (same process), following MCP tool design principles (naming, descriptions, error messages) without running a separate MCP transport. This avoids unnecessary complexity of running stdio/HTTP MCP transport between components that share the same process.

**Alternatives considered**:
- Separate MCP server with stdio transport: Adds process management complexity for zero benefit when agent and tools share same process
- FastMCP mounted on FastAPI: Useful for external MCP clients (e.g., Claude Desktop), but the primary consumer is the in-process agent
- Both: Register tools as both @function_tool and MCP tools — premature; can be added later if external MCP access is needed

**Key patterns**:
- 5 tools: `add_task`, `list_tasks`, `complete_task`, `update_task`, `delete_task`
- Tool names are action-oriented per tool-design skill
- Each tool receives `RunContextWrapper[ChatContext]` with `user_id` for scoped queries
- Tools call database directly (same-process, not HTTP), using standalone session factory
- Error messages are actionable: `{"error": "NOT_FOUND", "message": "...", "suggestion": "..."}`

## Decision 3: SSE Streaming

**Decision**: `sse-starlette` with `EventSourceResponse` for backend, `fetch` + `ReadableStream` for frontend

**Rationale**: `sse-starlette` provides automatic keep-alive pings, client disconnect detection, and proper SSE formatting. Frontend uses `fetch` + `ReadableStream` (not `EventSource`) because the chat endpoint is POST-based (sends message body) and needs Authorization headers.

**Alternatives considered**:
- Raw `StreamingResponse`: Works but requires manual SSE formatting, no ping/disconnect support
- WebSockets: Bidirectional capability not needed; SSE is simpler for server-push
- `EventSource` on frontend: GET-only, can't send POST body or custom headers

**Key patterns**:
- 5 SSE event types: `stream_start`, `text_token`, `task_action`, `stream_end`, `error`
- `task_action` event bridges chat stream to task panel refresh
- Backend: async generator yields `{"event": "...", "data": json.dumps(...)}`
- Frontend: `TextDecoder` + buffer parsing on double-newline boundaries
- AbortController for cancellation
- Install: `uv add sse-starlette`

## Decision 4: Conversation Persistence

**Decision**: Two new PostgreSQL tables (`chat_threads`, `chat_messages`) using existing SQLModel + asyncpg stack

**Rationale**: Additive schema change. Uses same GUID type, same session factory, same migration pattern as existing Task/User models. Last 50 messages loaded per thread as agent context.

**Alternatives considered**:
- Redis for chat history: Adds infrastructure dependency, less durable
- localStorage only: Current approach; loses data on clear, no cross-device
- Separate chat database: Unnecessary complexity for this scale

## Decision 5: Frontend Integration

**Decision**: Replace `useChat` hook internals only; keep all existing UI components unchanged

**Rationale**: Spec explicitly states no UI redesign. The existing ChatPanel, ChatMessage, ChatInput, ThinkingIndicator, and ActionCard components are reused. Only the data/hook layer changes: `useChat` switches from mock responses to real SSE streaming. `useTasks` gains a `refreshTasks()` call triggered by SSE `task_action` events.

**Alternatives considered**:
- New chat SDK (Vercel AI SDK): Adds dependency, doesn't match existing component structure
- Rebuild components: Explicitly out of scope per spec

## Decision 6: Agent Context and Multi-Turn

**Decision**: Stateless agent with conversation history loaded from database per request

**Rationale**: Agent is stateless — all state comes from the database. On each request, the last 50 messages for the thread are loaded and passed as the `input` messages list to `Runner.run_streamed()`. This enables multi-turn context (e.g., "complete the first one") without agent-side state. Thread title auto-generated from first message via a lightweight prompt.

**Key patterns**:
- Load messages: `SELECT * FROM chat_messages WHERE thread_id = ? ORDER BY created_at DESC LIMIT 50`
- Convert to OpenAI message format: `[{"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]`
- After completion, persist both user and assistant messages to database
- Thread title: use a system prompt like "Generate a 3-5 word title for this conversation based on the first message"

## New Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `openai-agents` | latest | OpenAI Agents SDK (Agent, Runner, function_tool) |
| `sse-starlette` | `>=2.1.0` | SSE streaming responses in FastAPI |
| `OPENAI_API_KEY` | env var | API key for OpenAI (server-side only) |
