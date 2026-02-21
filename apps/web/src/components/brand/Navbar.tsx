"use client";

import Link from "next/link";
import { SortedLogo } from "./SortedLogo";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-b border-emerald-600/20">
      {/* Accent glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-600/40 to-transparent" />

      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <SortedLogo size="md" />
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/auth/signin"
            className="px-4 py-2 text-sm font-mono font-medium text-white/50 hover:text-emerald-500
              tracking-wider uppercase transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="relative px-6 py-2 text-sm font-mono font-semibold text-white tracking-wider uppercase
              bg-emerald-600 hover:bg-emerald-500 transition-all duration-300
              shadow-[0_0_20px_-5px_rgba(5,150,105,0.4)]
              hover:shadow-[0_0_30px_-5px_rgba(5,150,105,0.6)]"
            style={{
              clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
            }}
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
