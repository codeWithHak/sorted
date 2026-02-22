"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LiveDemo } from "./LiveDemo";
import { RadialGlowButton } from "@/components/brand/RadialGlowButton";

export function MeetJettSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="meet-jett" className="py-24 relative" ref={sectionRef}>
      {/* Subtle ambient glow behind demo */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(5, 150, 105, 0.06) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-3xl px-6 relative">
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-white">
          Try Jett Now
        </h2>
        <p className="mb-12 text-center text-white/40 font-light max-w-xl mx-auto">
          See how Jett turns your natural language into structured tasks — instantly.
        </p>

        <LiveDemo isPlaying={isVisible} />

        <div className="mt-8 text-center">
          <p className="text-white/40">
            Built to cut through the noise. You speak chaos. Jett returns order.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <RadialGlowButton variant="primary" size="md" href="/auth/signup">
              Get Started with Jett
            </RadialGlowButton>
            <Link
              href="/agents/jett"
              className="text-sm font-mono font-medium text-white/40 hover:text-emerald-400 transition-colors uppercase tracking-wider"
            >
              Read Jett&apos;s story &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
