"use client";

import { useState, useCallback } from "react";
import type { AgentActivityState } from "@/lib/types/agent";

export function useAgentState() {
  const [state, setState] = useState<AgentActivityState>({
    status: "idle",
    activeAgentId: null,
    pendingTaskIds: [],
  });

  const setThinking = useCallback(() => {
    setState({
      status: "thinking",
      activeAgentId: "jett",
      pendingTaskIds: [],
    });
  }, []);

  const setActing = useCallback((taskIds: string[]) => {
    setState({
      status: "acting",
      activeAgentId: "jett",
      pendingTaskIds: taskIds,
    });
  }, []);

  const setIdle = useCallback(() => {
    setState({
      status: "idle",
      activeAgentId: null,
      pendingTaskIds: [],
    });
  }, []);

  return { agentState: state, setThinking, setActing, setIdle };
}
