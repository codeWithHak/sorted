"use client";

import { SortedLogo } from "@/components/brand/SortedLogo";

interface AppHeaderProps {
  userEmail: string;
  isAgentActive: boolean;
  onSignOut: () => void;
  onToggleSidebar: () => void;
}

export function AppHeader({ userEmail, isAgentActive, onSignOut, onToggleSidebar }: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-stone-200 bg-stone-50 px-4 py-3">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-md p-1.5 text-stone-500 hover:bg-stone-200 hover:text-stone-700 focus-visible:outline-2 focus-visible:outline-amber-500"
          aria-label="Toggle sidebar"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <SortedLogo isPulsing={isAgentActive} />
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-stone-500">{userEmail}</span>
        <button
          onClick={onSignOut}
          className="rounded-md border border-stone-300 px-3 py-1 text-sm text-stone-600 hover:bg-stone-100 transition-colors"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
