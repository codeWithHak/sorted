"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Agent {
  name: string;
  role: string;
  abilities: string[];
  portrait: string;
  glowColor: string;
  borderColor: string;
  available: boolean;
  href?: string;
}

const agents: Agent[] = [
  {
    name: "Jett",
    role: "Task Agent",
    abilities: ["Create tasks", "Prioritize", "Natural language"],
    portrait: "/jett.jpg",
    glowColor: "rgba(5, 150, 105, 0.4)",
    borderColor: "border-emerald-600/30",
    available: true,
    href: "/dashboard/jett",
  },
  {
    name: "Aria",
    role: "Calendar Agent",
    abilities: ["Scheduling", "Reminders", "Time blocking"],
    portrait: "/aria.jpg",
    glowColor: "rgba(6, 182, 212, 0.4)",
    borderColor: "border-cyan-500/30",
    available: false,
  },
  {
    name: "Flux",
    role: "Notes Agent",
    abilities: ["Capture ideas", "Organize", "Link thoughts"],
    portrait: "/flux.jpg",
    glowColor: "rgba(139, 92, 246, 0.4)",
    borderColor: "border-violet-500/30",
    available: false,
  },
  {
    name: "Pulse",
    role: "Habits Agent",
    abilities: ["Track habits", "Streaks", "Daily routines"],
    portrait: "/pulse.jpg",
    glowColor: "rgba(132, 204, 22, 0.4)",
    borderColor: "border-lime-500/30",
    available: false,
  },
];

function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div
      className={`group relative flex flex-col overflow-hidden
        border ${agent.borderColor} bg-white/[0.03]
        transition-all duration-500 hover:-translate-y-2
        hover:shadow-[0_0_60px_-15px_var(--glow)]`}
      style={{ "--glow": agent.glowColor } as React.CSSProperties}
    >
      {/* Portrait area with real AI image */}
      <div className="relative h-80 sm:h-96 overflow-hidden">
        <Image
          src={agent.portrait}
          alt={`${agent.name} — ${agent.role}`}
          fill
          className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 1024px) 90vw, 33vw"
        />

        {/* Cinematic color wash */}
        <div
          className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-500 mix-blend-color"
          style={{
            background: `linear-gradient(to bottom, ${agent.glowColor}, transparent 60%)`,
          }}
        />

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />

        {/* Status badge — top right */}
        <div className="absolute top-4 right-4">
          {agent.available ? (
            <span className="inline-flex items-center gap-1.5 bg-emerald-600/20 border border-emerald-600/30 px-3 py-1 text-xs font-mono font-medium text-emerald-500 backdrop-blur-sm uppercase tracking-wider">
              <span className="h-1.5 w-1.5 bg-emerald-600 animate-pulse" />
              Online
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 text-xs font-mono font-medium text-white/30 backdrop-blur-sm uppercase tracking-wider">
              Incoming
            </span>
          )}
        </div>
      </div>

      {/* Card content */}
      <div className="flex flex-col flex-1 p-5 border-t border-white/5">
        {/* Name and role */}
        <h3 className="text-2xl font-bold text-white tracking-tight">
          {agent.name}
        </h3>
        <p className="text-xs font-mono font-medium uppercase tracking-[0.2em] text-white/40 mt-1">
          {agent.role}
        </p>

        {/* Abilities */}
        <div className="mt-4 flex flex-wrap gap-2">
          {agent.abilities.map((ability) => (
            <span
              key={ability}
              className="bg-white/5 border border-white/10 px-3 py-1 text-xs font-mono text-white/50 uppercase tracking-wider"
            >
              {ability}
            </span>
          ))}
        </div>

        {/* Action */}
        <div className="mt-auto pt-5">
          {agent.available && agent.href ? (
            <a
              href={agent.href}
              className="inline-flex w-full items-center justify-center bg-emerald-600 px-6 py-3
                text-sm font-mono font-semibold text-white uppercase tracking-wider
                hover:bg-emerald-500 transition-all duration-300
                shadow-[0_0_20px_-5px_rgba(5,150,105,0.3)]
                hover:shadow-[0_0_30px_-5px_rgba(5,150,105,0.5)]"
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
              }}
            >
              Deploy {agent.name}
            </a>
          ) : (
            <div
              className="inline-flex w-full items-center justify-center bg-white/5 px-6 py-3
                text-sm font-mono font-medium text-white/20 border border-white/10 cursor-not-allowed uppercase tracking-wider"
            >
              Standby
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AgentShowcase() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  function updateScrollState() {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  function scrollCards(direction: "left" | "right") {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.querySelector("div")?.offsetWidth ?? 400;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -(cardWidth + 24) : cardWidth + 24,
      behavior: "smooth",
    });
  }

  return (
    <section id="agent-showcase" className="py-24 relative">
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, #050505 0%, #08080f 50%, #050505 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Section header with navigation */}
        <div className="flex items-end justify-between mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Meet the Agents
            </h2>
            <p className="mt-4 text-white/40 font-light max-w-xl">
              Each agent has their own specialty, personality, and way of
              helping you stay on top of life.
            </p>
          </div>

          {/* Navigation arrows */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scrollCards("left")}
              disabled={!canScrollLeft}
              className="h-10 w-10 flex items-center justify-center border border-white/20
                bg-white/5 text-white/60 hover:text-white hover:border-emerald-600/40
                disabled:opacity-20 disabled:cursor-not-allowed
                transition-all duration-300 cursor-pointer"
              aria-label="Previous agent"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollCards("right")}
              disabled={!canScrollRight}
              className="h-10 w-10 flex items-center justify-center border border-white/20
                bg-white/5 text-white/60 hover:text-white hover:border-emerald-600/40
                disabled:opacity-20 disabled:cursor-not-allowed
                transition-all duration-300 cursor-pointer"
              aria-label="Next agent"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cards — horizontal scroll, 3 visible at a time */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4
            scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden"
        >
          {agents.map((agent) => (
            <div
              key={agent.name}
              className="flex-shrink-0 w-[320px] sm:w-[calc((100%-48px)/3)]"
            >
              <AgentCard agent={agent} />
            </div>
          ))}
        </div>

        {/* Mobile navigation arrows */}
        <div className="flex justify-center gap-3 mt-6 sm:hidden">
          <button
            onClick={() => scrollCards("left")}
            disabled={!canScrollLeft}
            className="h-10 w-10 flex items-center justify-center border border-white/20
              bg-white/5 text-white/60 hover:text-white
              disabled:opacity-20 disabled:cursor-not-allowed
              transition-colors cursor-pointer"
            aria-label="Previous agent"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scrollCards("right")}
            disabled={!canScrollRight}
            className="h-10 w-10 flex items-center justify-center border border-white/20
              bg-white/5 text-white/60 hover:text-white
              disabled:opacity-20 disabled:cursor-not-allowed
              transition-colors cursor-pointer"
            aria-label="Next agent"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
