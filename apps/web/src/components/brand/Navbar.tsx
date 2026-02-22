"use client";

import Link from "next/link";
import { SortedLogo } from "./SortedLogo";
import { RadialGlowButton } from "./RadialGlowButton";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-b border-emerald-600/20">
      {/* Accent glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-600/40 to-transparent" />

      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <SortedLogo size="md" />
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/auth/signin"
            className="hidden sm:inline-block px-3 sm:px-4 py-2 text-sm font-mono font-medium text-white/50 hover:text-emerald-400
              tracking-wider uppercase transition-colors"
          >
            Sign in
          </Link>
          <RadialGlowButton variant="primary" size="sm" href="/auth/signup">
            Get Started
          </RadialGlowButton>
        </div>
      </div>
    </nav>
  );
}
