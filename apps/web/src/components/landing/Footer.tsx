import Link from "next/link";
import { SortedLogo } from "@/components/brand/SortedLogo";

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-50">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <SortedLogo size="sm" />
        <nav className="flex items-center gap-6">
          <Link href="/auth/signin" className="text-sm text-stone-500 hover:text-stone-900">
            Sign in
          </Link>
        </nav>
      </div>
    </footer>
  );
}
