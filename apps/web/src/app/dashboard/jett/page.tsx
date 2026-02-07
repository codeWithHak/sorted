"use client";

import Link from "next/link";
import { agents } from "@/data/agents";

const jett = agents.find((a) => a.id === "jett")!;

export default function JettLorePage() {
  return (
    <main className="min-h-screen bg-stone-900 text-stone-100">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <Link
          href="/dashboard"
          className="text-sm text-stone-400 hover:text-stone-200 transition-colors"
        >
          &larr; Back to dashboard
        </Link>

        <div className="mt-12 flex flex-col items-center text-center">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse rounded-full bg-amber-500/20 blur-xl" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-amber-500 text-3xl font-bold text-white">
              J
            </div>
          </div>
          <h1 className="mt-6 text-3xl font-bold text-white">Jett</h1>
          <p className="mt-1 text-amber-400 font-medium">{jett.role}</p>
          <p className="mt-2 text-stone-400 italic">&ldquo;{jett.tagline}&rdquo;</p>
        </div>

        <section className="mt-16">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-500">
            Origin
          </h2>
          <p className="mt-4 leading-relaxed text-stone-300">
            {jett.lore?.origin}
          </p>
        </section>

        <section className="mt-16">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-500">
            Abilities
          </h2>
          <div className="mt-6 grid gap-4">
            {jett.lore?.abilities.map((ability) => (
              <div
                key={ability.name}
                className="rounded-xl border border-stone-700 bg-stone-800 p-5"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{ability.icon}</span>
                  <h3 className="font-semibold text-white">{ability.name}</h3>
                </div>
                <p className="mt-2 text-sm text-stone-400">{ability.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
