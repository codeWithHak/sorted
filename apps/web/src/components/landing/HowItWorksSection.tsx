"use client";

import { Zap, MessageSquare, CheckCircle } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: <MessageSquare className="h-5 w-5" />,
    label: "Speak",
    title: "Talk naturally",
    description:
      "Tell Jett what you need in your own words. No forms, no menus.",
    accent: "emerald",
  },
  {
    num: "02",
    icon: <Zap className="h-5 w-5" />,
    label: "Process",
    title: "Jett takes action",
    description:
      "Your words become tasks, plans, and structure — instantly.",
    accent: "cyan",
  },
  {
    num: "03",
    icon: <CheckCircle className="h-5 w-5" />,
    label: "Execute",
    title: "Stay on track",
    description:
      "Check off, reprioritize, and keep moving. Jett adapts with you.",
    accent: "emerald",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-36 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, #050505 0%, #080810 50%, #050505 100%)",
        }}
        aria-hidden="true"
      />

      {/* Faint grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "3rem 3rem",
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl px-6 relative">
        {/* Section header */}
        <div className="text-center mb-20">
          <span className="inline-block text-xs font-mono font-medium text-emerald-500/70 uppercase tracking-[0.3em] mb-4">
            // Protocol
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            How it works
          </h2>
          <p className="mt-4 text-white/30 font-light max-w-md mx-auto text-sm">
            Three steps. No learning curve. Just results.
          </p>
        </div>

        {/* HUD Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative">
          {/* Connecting line behind panels (desktop) */}
          <div className="hidden md:block absolute top-1/2 left-[16.67%] right-[16.67%] h-px -translate-y-1/2 z-0">
            <div className="h-full w-full border-t border-dashed border-emerald-500/20" />
            {/* Animated pulse dot */}
            <div
              className="absolute top-1/2 -translate-y-1/2 h-2 w-2 bg-emerald-500 shadow-[0_0_12px_rgba(5,150,105,0.8)]"
              style={{
                animation: "hudPulseTravel 4s ease-in-out infinite",
              }}
            />
          </div>

          {steps.map((step, i) => (
            <div key={step.num} className="relative z-10 flex flex-col items-center px-3">
              {/* Mobile connecting line */}
              {i < steps.length - 1 && (
                <div className="md:hidden w-px h-8 border-l border-dashed border-emerald-500/20 my-0" />
              )}

              {/* HUD Panel */}
              <div className="group relative w-full min-h-[300px] border border-white/[0.08] bg-white/[0.02] px-8 py-10 transition-all duration-500 hover:border-emerald-500/30 hover:bg-white/[0.05] overflow-hidden">
                {/* Scan line effect */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(5,150,105,0.03) 2px, rgba(5,150,105,0.03) 4px)",
                  }}
                />

                {/* Top-left corner accent */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-500/40 transition-colors duration-500 group-hover:border-emerald-400/70" />
                {/* Bottom-right corner accent */}
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-500/40 transition-colors duration-500 group-hover:border-emerald-400/70" />

                {/* Step number — large watermark */}
                <div className="absolute top-4 right-5 text-7xl font-bold font-mono text-white/[0.04] group-hover:text-emerald-500/[0.08] transition-colors duration-500 select-none">
                  {step.num}
                </div>

                {/* Content */}
                <div className="relative">
                  {/* Label row */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center justify-center h-8 w-8 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 group-hover:shadow-[0_0_16px_-4px_rgba(5,150,105,0.5)] transition-all duration-500">
                      {step.icon}
                    </div>
                    <span className="text-[10px] font-mono font-medium text-emerald-500/60 uppercase tracking-[0.25em]">
                      {step.num} — {step.label}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent mb-5" />

                  {/* Title */}
                  <h3 className="text-xl font-mono font-semibold text-white uppercase tracking-wider mb-3">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/35 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Bottom status bar */}
                <div className="mt-8 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-white/20 uppercase tracking-wider">
                    Active
                  </span>
                </div>
              </div>

              {/* Mobile connecting line (after panel) */}
              {i < steps.length - 1 && (
                <div className="md:hidden w-px h-8 border-l border-dashed border-emerald-500/20 my-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Keyframe for pulse dot traveling */}
      <style jsx>{`
        @keyframes hudPulseTravel {
          0%, 100% {
            left: 0%;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          50% {
            left: 50%;
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          95% {
            left: 100%;
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}
