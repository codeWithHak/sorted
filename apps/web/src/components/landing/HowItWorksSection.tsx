"use client";

import { Zap, MessageSquare, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: "Talk naturally",
    description:
      "Tell Jett what you need in your own words. No forms, no menus.",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Jett takes action",
    description:
      "Your words become tasks, plans, and structure — instantly.",
  },
  {
    icon: <CheckCircle className="h-6 w-6" />,
    title: "Stay on track",
    description:
      "Check off, reprioritize, and keep moving. Jett adapts with you.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 relative">
      {/* Background subtle gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, #050505 0%, #0a0a0f 50%, #050505 100%)",
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-5xl px-6 relative">
        <h2 className="text-center text-3xl md:text-4xl font-bold tracking-tight text-white">
          How it works
        </h2>
        <p className="mt-4 text-center text-white/40 font-light max-w-xl mx-auto">
          Three simple steps. No learning curve. Just results.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="relative text-center group"
            >
              {/* Connecting line (visible between cards on desktop) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px border-t border-dashed border-white/10" />
              )}

              <div
                className="border border-white/10 bg-white/[0.03] p-8 transition-all duration-500
                  hover:bg-white/[0.08] hover:shadow-[0_0_40px_-10px_rgba(5,150,105,0.15)]
                  hover:-translate-y-1 hover:border-emerald-600/30"
              >
                <div
                  className="mx-auto flex h-14 w-14 items-center justify-center
                    bg-gradient-to-br from-emerald-600 to-cyan-700 text-white
                    shadow-[0_0_24px_-4px_rgba(5,150,105,0.4)]
                    group-hover:shadow-[0_0_32px_-4px_rgba(5,150,105,0.6)]
                    transition-shadow duration-500"
                >
                  {step.icon}
                </div>
                <h3 className="mt-5 text-lg font-mono font-semibold text-white uppercase tracking-wider">
                  {step.title}
                </h3>
                <p className="mt-2 text-white/40 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
