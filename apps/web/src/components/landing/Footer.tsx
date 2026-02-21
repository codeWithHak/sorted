import Link from "next/link";
import { SortedLogo } from "@/components/brand/SortedLogo";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/40">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <div className="flex flex-col items-center sm:items-start gap-1">
          <SortedLogo size="sm" />
          <span className="text-xs font-mono text-white/20 uppercase tracking-wider">
            The universe is expanding.
          </span>
        </div>
        <nav className="flex items-center gap-6">
          <Link
            href="/auth/signin"
            className="text-sm font-mono text-white/40 hover:text-emerald-500 transition-colors uppercase tracking-wider"
          >
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="text-sm font-mono text-white/40 hover:text-emerald-500 transition-colors uppercase tracking-wider"
          >
            Get Started
          </Link>
        </nav>
      </div>
    </footer>
  );
}
