"use client";

import Link from "next/link";
import { SortedLogo } from "@/components/brand/SortedLogo";

interface AppHeaderProps {
  userEmail: string;
  isAgentActive: boolean;
  onSignOut: () => void;
  onToggleSidebar: () => void;
}

export function AppHeader({ userEmail, isAgentActive, onSignOut, onToggleSidebar }: AppHeaderProps) {
  return (
    <header className="relative flex items-center justify-between border-b border-white/10 bg-black/60 backdrop-blur-xl px-4 py-3">
      {/* Accent glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-600/40 to-transparent" />

      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 text-white/40 hover:bg-white/10 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-emerald-500"
          aria-label="Toggle sidebar"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <Link href="/" className="flex items-center">
          <SortedLogo isPulsing={isAgentActive} />
        </Link>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <span className="hidden sm:inline text-sm font-mono text-white/30 truncate max-w-[180px]">{userEmail}</span>
        <button
          onClick={onSignOut}
          className="border border-white/10 px-2 sm:px-3 py-1 text-xs sm:text-sm font-mono text-white/40 hover:bg-white/10 hover:text-white/70 transition-colors uppercase tracking-wider whitespace-nowrap"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
