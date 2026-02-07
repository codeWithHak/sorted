"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { AgentActivityState } from "@/lib/types/agent";

interface AgentActivityContextValue {
  agentState: AgentActivityState;
  setThinking: () => void;
  setActing: (taskIds: string[]) => void;
  setIdle: () => void;
}

const defaultState: AgentActivityState = {
  status: "idle",
  activeAgentId: null,
  pendingTaskIds: [],
};

const AgentActivityContext = createContext<AgentActivityContextValue>({
  agentState: defaultState,
  setThinking: () => {},
  setActing: () => {},
  setIdle: () => {},
});

export function AgentActivityProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AgentActivityState>(defaultState);

  const setThinking = useCallback(() => {
    setState({ status: "thinking", activeAgentId: "jett", pendingTaskIds: [] });
  }, []);

  const setActing = useCallback((taskIds: string[]) => {
    setState({ status: "acting", activeAgentId: "jett", pendingTaskIds: taskIds });
  }, []);

  const setIdle = useCallback(() => {
    setState({ status: "idle", activeAgentId: null, pendingTaskIds: [] });
  }, []);

  return (
    <AgentActivityContext.Provider value={{ agentState: state, setThinking, setActing, setIdle }}>
      {children}
    </AgentActivityContext.Provider>
  );
}

export function useAgentActivity() {
  return useContext(AgentActivityContext);
}
