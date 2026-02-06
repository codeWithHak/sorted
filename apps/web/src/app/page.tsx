import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-4 p-8 font-sans">
      <h1 className="text-3xl font-semibold tracking-tight">sorted</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        A todo app that keeps things simple.
      </p>
      <div className="flex gap-3">
        <Link
          href="/auth/signin"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Sign in
        </Link>
        <Link
          href="/auth/signup"
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          Create account
        </Link>
      </div>
    </main>
  );
}
