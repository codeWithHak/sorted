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
    <aside className="flex w-56 shrink-0 flex-col border-r border-stone-200 bg-white">
      <div className="flex items-center justify-between border-b border-stone-100 px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
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
            href="/dashboard/jett"
            className="text-xs text-amber-600 hover:text-amber-700 transition-colors"
          >
            About Jett &rarr;
          </Link>
        </div>
      </div>
    </aside>
  );
}
