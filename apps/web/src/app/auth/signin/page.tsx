"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { SortedLogo } from "@/components/brand/SortedLogo";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: signInError } = await authClient.signIn.email({
      email,
      password,
    });

    if (signInError) {
      setLoading(false);
      setError("Invalid email or password");
      return;
    }

    router.push(callbackUrl);
  }

  return (
    <main className="relative mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 p-8 font-sans">
      {/* Subtle ambient glow */}
      <div
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(5, 150, 105, 0.06) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative">
        <div className="mb-8">
          <Link href="/">
            <SortedLogo size="md" />
          </Link>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Sign in</h1>
        <p className="mt-1 text-sm text-white/40">
          Welcome back to sorted.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium font-mono text-white/60 uppercase tracking-wider">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-emerald-600 transition-colors placeholder:text-white/20"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium font-mono text-white/60 uppercase tracking-wider">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-emerald-600 transition-colors placeholder:text-white/20"
          />
        </label>

        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-emerald-600 px-4 py-2.5 text-sm font-mono font-semibold text-white uppercase tracking-wider
            hover:bg-emerald-500 transition-all duration-300 disabled:opacity-50
            shadow-[0_0_20px_-5px_rgba(5,150,105,0.4)]
            hover:shadow-[0_0_30px_-5px_rgba(5,150,105,0.6)]"
          style={{
            clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
          }}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="relative text-center text-sm text-white/40">
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="text-emerald-500 hover:text-emerald-400 transition-colors">
          Sign up
        </Link>
      </p>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
