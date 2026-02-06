"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api-client";

interface BackendUser {
  id: string;
  email: string;
}

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const [backendUser, setBackendUser] = useState<BackendUser | null>(null);
  const [backendError, setBackendError] = useState("");

  useEffect(() => {
    if (!session?.user) return;

    apiFetch("/auth/me")
      .then(async (res) => {
        if (!res.ok) throw new Error(`${res.status}`);
        return res.json();
      })
      .then(setBackendUser)
      .catch((err) => setBackendError(err.message));
  }, [session?.user]);

  if (isPending) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-4 p-8 font-sans">
        <p className="text-zinc-500">Loading...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-4 p-8 font-sans">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

      <div className="rounded-md border border-zinc-200 p-4 dark:border-zinc-800">
        <p className="text-sm text-zinc-500">Signed in as</p>
        <p className="font-medium">{session?.user?.name}</p>
        <p className="text-sm text-zinc-500">{session?.user?.email}</p>
      </div>

      <div className="rounded-md border border-zinc-200 p-4 dark:border-zinc-800">
        <p className="text-sm font-medium text-zinc-500">Backend verification</p>
        {backendUser ? (
          <p className="text-sm text-green-600 dark:text-green-400">
            Verified: {backendUser.email} (id: {backendUser.id})
          </p>
        ) : backendError ? (
          <p className="text-sm text-red-600 dark:text-red-400">
            Backend error: {backendError}
          </p>
        ) : (
          <p className="text-sm text-zinc-400">Verifying...</p>
        )}
      </div>
    </main>
  );
}
