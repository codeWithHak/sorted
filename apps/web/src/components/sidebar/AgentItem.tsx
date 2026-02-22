import Image from "next/image";
import type { Agent } from "@/lib/types/agent";

interface AgentItemProps {
  agent: Agent;
  isActive: boolean;
}

export function AgentItem({ agent, isActive }: AgentItemProps) {
  if (agent.status === "coming_soon") {
    return (
      <div className="flex items-center gap-3 px-3 py-2 cursor-default">
        <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden bg-white/5" style={{ borderRadius: 8 }}>
          {agent.portrait ? (
            <Image
              src={agent.portrait}
              alt={agent.name}
              fill
              className="object-cover opacity-30 grayscale"
              sizes="32px"
            />
          ) : (
            <div className="h-4 w-4 bg-white/10" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white/20">{agent.name}</p>
          <p className="text-xs text-white/20">{agent.role}</p>
          <p className="text-[10px] font-mono text-white/10 uppercase tracking-wider">coming soon</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 transition-colors">
      <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden" style={{ borderRadius: 8 }}>
        {agent.portrait ? (
          <Image
            src={agent.portrait}
            alt={agent.name}
            fill
            className="object-cover"
            sizes="32px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-emerald-600 text-xs font-bold text-white">
            {agent.name[0]}
          </div>
        )}
        {isActive && (
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 border-2 border-[#0a0a0a] bg-emerald-500 rounded-full z-10" />
        )}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-white">{agent.name}</p>
        <p className="text-xs text-white/40">{agent.role}</p>
      </div>
    </div>
  );
}
