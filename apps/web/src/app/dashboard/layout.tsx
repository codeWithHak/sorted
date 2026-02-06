"use client";

import { useRouter } from "next/navigation";
import { useSession, authClient } from "@/lib/auth-client";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session } = useSession();

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/auth/signin");
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-8 py-3">
          <span className="text-sm font-semibold tracking-tight">sorted</span>
          <div className="flex items-center gap-4">
            {session?.user && (
              <span className="text-sm text-zinc-500">{session.user.email}</span>
            )}
            <button
              onClick={handleSignOut}
              className="rounded-md border border-zinc-300 px-3 py-1 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
