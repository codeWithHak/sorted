"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LiveDemo } from "./LiveDemo";

export function MeetJettSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="meet-jett" className="py-24" ref={sectionRef}>
      <div className="mx-auto max-w-3xl px-6">
        <p className="mb-12 text-center text-lg text-stone-500">
          Every universe starts somewhere. Meet Jett — your task agent.
        </p>

        <LiveDemo isPlaying={isVisible} />

        <div className="mt-8 text-center">
          <p className="text-stone-500">
            Built to cut through the noise. You speak chaos. Jett returns order.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/auth/signup"
              className="rounded-full bg-amber-500 px-8 py-3 text-base font-medium text-white hover:bg-amber-600 transition-colors"
            >
              Get Started with Jett
            </Link>
            <Link
              href="/dashboard/jett"
              className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
            >
              Read Jett&apos;s story &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
