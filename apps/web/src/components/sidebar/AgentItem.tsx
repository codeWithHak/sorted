import type { Agent } from "@/lib/types/agent";

interface AgentItemProps {
  agent: Agent;
  isActive: boolean;
}

export function AgentItem({ agent, isActive }: AgentItemProps) {
  if (agent.status === "coming_soon") {
    return (
      <div className="flex items-center gap-3 rounded-lg px-3 py-2 cursor-default">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100">
          <div className="h-4 w-4 rounded-full bg-stone-300" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-stone-400">{agent.name}</p>
          <p className="text-xs text-stone-400">{agent.role}</p>
          <p className="text-[10px] text-stone-300">coming soon</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-stone-100 transition-colors">
      <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
        {agent.name[0]}
        {isActive && (
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-amber-400" />
        )}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-stone-900">{agent.name}</p>
        <p className="text-xs text-stone-500">{agent.role}</p>
      </div>
    </div>
  );
}
