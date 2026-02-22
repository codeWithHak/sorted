"use client";

import Image from "next/image";
import Link from "next/link";
import { agents } from "@/data/agents";
import { RadialGlowButton } from "@/components/brand/RadialGlowButton";

const jett = agents.find((a) => a.id === "jett")!;

export default function JettLorePage() {
  return (
    <main className="h-screen bg-[#050505] text-white overflow-hidden flex flex-col">
      {/* Back link */}
      <div className="px-6 pt-5 pb-2">
        <Link
          href="/"
          className="text-sm font-mono text-white/40 hover:text-emerald-400 transition-colors uppercase tracking-wider"
        >
          &larr; Back
        </Link>
      </div>

      {/* Main content — fills remaining space */}
      <div className="flex-1 flex flex-col lg:flex-row items-center lg:items-stretch gap-6 lg:gap-12 px-6 lg:px-16 pb-8">
        {/* Left — Jett portrait */}
        <div className="relative flex-shrink-0 flex items-center justify-center">
          {/* Emerald ambient glow */}
          <div
            className="absolute inset-0 blur-3xl opacity-25 pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(5,150,105,0.5), transparent 70%)",
            }}
            aria-hidden="true"
          />
          <div
            className="relative w-[280px] h-[360px] sm:w-[320px] sm:h-[420px] lg:w-[380px] lg:h-full overflow-hidden"
            style={{ borderRadius: 20 }}
          >
            <Image
              src="/jett.jpg"
              alt="Jett — Task Agent"
              fill
              priority
              className="object-cover object-top"
              sizes="380px"
            />
            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent" />
          </div>
        </div>

        {/* Right — identity + origin + CTA */}
        <div className="flex-1 flex flex-col justify-center text-center lg:text-left max-w-xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-white">
            {jett.name}
          </h1>
          <p className="mt-1 text-sm font-mono font-medium uppercase tracking-[0.25em] text-emerald-400/90">
            {jett.role}
          </p>
          <p className="mt-2 text-white/35 italic">
            &ldquo;{jett.tagline}&rdquo;
          </p>

          {/* Origin divider */}
          <div className="mt-6 flex items-center gap-3 justify-center lg:justify-start">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-emerald-500">
              Origin
            </span>
            <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-emerald-600/40 to-transparent" />
          </div>

          <p className="mt-4 text-sm sm:text-base leading-[1.8] text-white/45 font-light">
            {jett.lore?.origin}
          </p>

          {/* CTA */}
          <div className="mt-6 flex flex-col sm:flex-row items-center lg:items-start gap-4">
            <RadialGlowButton variant="primary" size="md" href="/auth/signup">
              Get Started with Jett
            </RadialGlowButton>
          </div>
        </div>
      </div>
    </main>
  );
}
