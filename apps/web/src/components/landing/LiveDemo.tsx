"use client";

import { useState, useEffect, useCallback, useRef } from "react";

type DemoStep =
  | "idle"
  | "greeting"
  | "typing"
  | "user-message"
  | "thinking"
  | "response"
  | "tasks-in"
  | "complete"
  | "fade";

const DEMO_TASKS = [
  "Review project brief",
  "Draft client email",
  "Prep for standup",
];

export function LiveDemo({ isPlaying }: { isPlaying: boolean }) {
  const [step, setStep] = useState<DemoStep>("idle");
  const [typedText, setTypedText] = useState("");
  const [completedTask, setCompletedTask] = useState(-1);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const typingRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const fullMessage = "plan my morning";

  const resetDemo = useCallback(() => {
    setStep("idle");
    setTypedText("");
    setCompletedTask(-1);
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      resetDemo();
      return;
    }

    function advance(nextStep: DemoStep, delay: number) {
      timeoutRef.current = setTimeout(() => setStep(nextStep), delay);
    }

    if (step === "idle") advance("greeting", 500);
    if (step === "greeting") advance("typing", 1500);
    if (step === "typing") {
      let i = 0;
      typingRef.current = setInterval(() => {
        i++;
        setTypedText(fullMessage.slice(0, i));
        if (i >= fullMessage.length) {
          clearInterval(typingRef.current);
          timeoutRef.current = setTimeout(() => setStep("user-message"), 400);
        }
      }, 60);
    }
    if (step === "user-message") advance("thinking", 800);
    if (step === "thinking") advance("response", 1500);
    if (step === "response") advance("tasks-in", 800);
    if (step === "tasks-in") {
      timeoutRef.current = setTimeout(() => setCompletedTask(0), 2000);
      timeoutRef.current = setTimeout(() => setStep("complete"), 2500);
    }
    if (step === "complete") advance("fade", 2000);
    if (step === "fade") {
      timeoutRef.current = setTimeout(resetDemo, 1000);
    }

    return () => {
      clearTimeout(timeoutRef.current);
      clearInterval(typingRef.current);
    };
  }, [step, isPlaying, resetDemo]);

  const showGreeting = step !== "idle";
  const showTyping = step === "typing";
  const showUserMessage = ["user-message", "thinking", "response", "tasks-in", "complete", "fade"].includes(step);
  const showThinking = step === "thinking";
  const showResponse = ["response", "tasks-in", "complete", "fade"].includes(step);
  const showTasks = ["tasks-in", "complete", "fade"].includes(step);
  const isFading = step === "fade";

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-stone-200 bg-white transition-opacity duration-700 ${isFading ? "opacity-30" : "opacity-100"}`}
      style={{ boxShadow: "var(--shadow-warm)" }}
    >
      <div className="flex items-center gap-2 border-b border-stone-100 px-4 py-3">
        <div className="h-3 w-3 rounded-full bg-stone-200" />
        <div className="h-3 w-3 rounded-full bg-stone-200" />
        <div className="h-3 w-3 rounded-full bg-stone-200" />
        <span className="ml-2 text-xs text-stone-400">sorted</span>
      </div>

      <div className="flex min-h-[320px] flex-col sm:min-h-[360px]">
        <div className="flex flex-1 flex-col gap-3 p-4">
          {showGreeting && (
            <div className="flex gap-2 transition-opacity duration-300">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
                J
              </div>
              <div className="rounded-xl rounded-tl-sm border-l-2 border-amber-200 bg-white px-3 py-2 text-sm text-stone-700">
                Hey! I&apos;m Jett. What do you need to get done?
              </div>
            </div>
          )}

          {showTyping && !showUserMessage && (
            <div className="flex justify-end">
              <div className="rounded-xl rounded-br-sm bg-stone-100 px-3 py-2 text-sm text-stone-700">
                {typedText}
                <span className="ml-0.5 inline-block w-0.5 h-4 bg-stone-400 animate-pulse" />
              </div>
            </div>
          )}

          {showUserMessage && (
            <div className="flex justify-end transition-opacity duration-300">
              <div className="rounded-xl rounded-br-sm bg-stone-100 px-3 py-2 text-sm text-stone-700">
                {fullMessage}
              </div>
            </div>
          )}

          {showThinking && (
            <div className="flex gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
                J
              </div>
              <div className="flex items-center gap-1 rounded-xl px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          {showResponse && (
            <div className="flex gap-2 transition-opacity duration-300">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
                J
              </div>
              <div className="rounded-xl rounded-tl-sm border-l-2 border-amber-200 bg-white px-3 py-2 text-sm text-stone-700">
                Here&apos;s your morning plan:
              </div>
            </div>
          )}

          {showTasks && (
            <div className="ml-9 space-y-2">
              {DEMO_TASKS.map((task, i) => (
                <div
                  key={task}
                  className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm transition-all duration-300"
                  style={{
                    animationDelay: `${i * 100}ms`,
                    opacity: 1,
                  }}
                >
                  <div
                    className={`h-4 w-4 shrink-0 rounded border transition-colors duration-300 ${
                      completedTask >= i
                        ? "border-amber-500 bg-amber-500"
                        : "border-stone-300"
                    }`}
                  >
                    {completedTask >= i && (
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={completedTask >= i ? "text-stone-400 line-through" : "text-stone-700"}>
                    {task}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-stone-100 p-3">
          <div className="flex items-center rounded-xl border border-stone-200 bg-stone-50 px-3 py-2">
            <span className="flex-1 text-sm text-stone-400">Ask Jett to plan your day...</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-white">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
