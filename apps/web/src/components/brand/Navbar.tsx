"use client";

import { useState } from "react";
import Link from "next/link";
import { SortedLogo } from "./SortedLogo";
import { RadialGlowButton } from "./RadialGlowButton";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-b border-emerald-600/20">
      {/* Accent glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-600/40 to-transparent" />

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-8 lg:px-12 py-3">
        <Link href="/" className="flex items-center gap-2">
          <SortedLogo size="md" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-2">
          <Link
            href="/auth/signin"
            className="px-4 py-2 text-sm font-mono font-medium text-white/50 hover:text-emerald-400
              tracking-wider uppercase transition-colors"
          >
            Sign in
          </Link>
          <RadialGlowButton variant="primary" size="sm" href="/auth/signup">
            Get Started
          </RadialGlowButton>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px]"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-[2px] bg-white/70 transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-[7px]" : ""
            }`}
          />
          <span
            className={`block w-5 h-[2px] bg-white/70 transition-all duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-[2px] bg-white/70 transition-all duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-[7px]" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-48 border-t border-white/10" : "max-h-0"
        }`}
      >
        <div className="flex flex-col items-center gap-4 px-4 py-6 bg-black/80 backdrop-blur-xl">
          <Link
            href="/auth/signin"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-mono font-medium text-white/50 hover:text-emerald-400
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
