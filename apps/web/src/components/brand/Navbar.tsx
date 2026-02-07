"use client";

import Link from "next/link";
import { SortedLogo } from "./SortedLogo";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/">
          <SortedLogo size="md" />
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/auth/signin"
            className="text-sm font-medium text-stone-600 hover:text-stone-900"
          >
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="rounded-full bg-amber-500 px-5 py-2 text-sm font-medium text-white hover:bg-amber-600 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
