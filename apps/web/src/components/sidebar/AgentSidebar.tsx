"use client";

import Link from "next/link";
import type { Agent } from "@/lib/types/agent";
import { AgentItem } from "./AgentItem";

interface AgentSidebarProps {
  agents: Agent[];
  activeAgentId: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function AgentSidebar({ agents, activeAgentId, isCollapsed }: AgentSidebarProps) {
  if (isCollapsed) return null;

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-white/10 bg-[#0a0a0a]">
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-white/30">
          Agents
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {agents.map((agent) => (
            <AgentItem
              key={agent.id}
              agent={agent}
              isActive={agent.id === activeAgentId}
            />
          ))}
        </div>
        <div className="mt-4 px-3">
          <Link
            href="/agents/jett"
            className="text-xs font-mono text-emerald-600 hover:text-emerald-500 transition-colors uppercase tracking-wider"
          >
            About Jett &rarr;
          </Link>
        </div>
      </div>
    </aside>
  );
}
