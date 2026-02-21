"use client";

import { DottedGlobe } from "@/components/effects/DottedGlobe";

const futureAgents = [
  {
    name: "Jett",
    role: "Task Agent",
    color: "amber",
    glow: "rgba(245, 158, 11, 0.3)",
    borderColor: "border-amber-500/30",
    dotColor: "bg-amber-500",
    available: true,
  },
  {
    name: "Aria",
    role: "Calendar Agent",
    color: "sky",
    glow: "rgba(14, 165, 233, 0.3)",
    borderColor: "border-sky-500/30",
    dotColor: "bg-sky-500",
    available: false,
  },
  {
    name: "Flux",
    role: "Notes Agent",
    color: "violet",
    glow: "rgba(139, 92, 246, 0.3)",
    borderColor: "border-violet-500/30",
    dotColor: "bg-violet-500",
    available: false,
  },
  {
    name: "Pulse",
    role: "Habits Agent",
    color: "emerald",
    glow: "rgba(5, 150, 105, 0.3)",
    borderColor: "border-emerald-600/30",
    dotColor: "bg-emerald-600",
    available: false,
  },
];

export function VisionSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight text-white">
          Jett is just the first.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-white/40 font-light">
          The Sorted Universe is growing. New agents are being built — each with
          their own specialty, their own personality, their own way of helping
          you stay on top of life.
        </p>

        <div className="mt-16 flex flex-col lg:flex-row items-center gap-12">
          {/* Globe */}
          <div className="relative flex-shrink-0">
            {/* Ambient glow behind globe */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse, rgba(139, 92, 246, 0.08) 0%, transparent 70%)",
              }}
              aria-hidden="true"
            />
            <DottedGlobe size={350} />
          </div>

          {/* Agent cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 w-full">
            {futureAgents.map((agent) => (
              <div
                key={agent.name}
                className={`group relative rounded-2xl glass glass-hover p-6 transition-all duration-500
                  hover:-translate-y-1 ${agent.borderColor}`}
                style={{
                  boxShadow: `0 0 0px ${agent.glow}`,
                  transition: "box-shadow 0.5s, transform 0.5s, border-color 0.5s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    `0 0 40px -10px ${agent.glow}`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    `0 0 0px ${agent.glow}`;
                }}
              >
                {/* Agent avatar placeholder */}
                <div className="flex items-center gap-3">
                  <div
                    className={`h-12 w-12 rounded-full bg-white/5 flex items-center justify-center
                      border ${agent.borderColor}`}
                  >
                    <span className="text-lg font-semibold text-white/60">
                      {agent.name[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      {agent.name}
                    </h3>
                    <p className="text-sm text-white/40">{agent.role}</p>
                  </div>
                </div>

                {/* Status badge */}
                <div className="mt-4">
                  {agent.available ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-medium text-amber-400">
                      <span className={`h-1.5 w-1.5 rounded-full ${agent.dotColor} animate-pulse`} />
                      available
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-medium text-white/30">
                      <span className={`h-1.5 w-1.5 rounded-full ${agent.dotColor} opacity-40`} />
                      coming soon
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
