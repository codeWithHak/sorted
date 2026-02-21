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
  const showUserMessage = [
    "user-message",
    "thinking",
    "response",
    "tasks-in",
    "complete",
    "fade",
  ].includes(step);
  const showThinking = step === "thinking";
  const showResponse = ["response", "tasks-in", "complete", "fade"].includes(
    step
  );
  const showTasks = ["tasks-in", "complete", "fade"].includes(step);
  const isFading = step === "fade";

  return (
    <div
      className={`overflow-hidden border border-white/10 bg-gray-950 transition-opacity duration-700 ${
        isFading ? "opacity-30" : "opacity-100"
      }`}
      style={{
        boxShadow: "0 0 80px -20px rgba(5, 150, 105, 0.15)",
      }}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
        <div className="h-3 w-3 bg-rose-500/80" />
        <div className="h-3 w-3 bg-emerald-500/80" />
        <div className="h-3 w-3 bg-emerald-600/80" />
        <span className="ml-2 text-xs text-white/30 font-mono uppercase tracking-wider">sorted</span>
      </div>

      <div className="flex min-h-[320px] flex-col sm:min-h-[360px]">
        <div className="flex flex-1 flex-col gap-3 p-4">
          {showGreeting && (
            <div className="flex gap-2 transition-opacity duration-300">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-emerald-600 text-xs font-bold text-white shadow-[0_0_12px_rgba(5,150,105,0.4)]">
                J
              </div>
              <div className="border-l-0 border-l-2 border-emerald-600/30 bg-white/5 px-3 py-2 text-sm text-white/80">
                Hey! I&apos;m Jett. What do you need to get done?
              </div>
            </div>
          )}

          {showTyping && !showUserMessage && (
            <div className="flex justify-end">
              <div className=" bg-white/10 px-3 py-2 text-sm text-white/80">
                {typedText}
                <span className="ml-0.5 inline-block w-0.5 h-4 bg-emerald-500 animate-pulse" />
              </div>
            </div>
          )}

          {showUserMessage && (
            <div className="flex justify-end transition-opacity duration-300">
              <div className=" bg-white/10 px-3 py-2 text-sm text-white/80">
                {fullMessage}
              </div>
            </div>
          )}

          {showThinking && (
            <div className="flex gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-emerald-600 text-xs font-bold text-white shadow-[0_0_12px_rgba(5,150,105,0.4)]">
                J
              </div>
              <div className="flex items-center gap-1 px-3 py-2">
                <span
                  className="h-2 w-2 bg-emerald-500 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="h-2 w-2 bg-emerald-500 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="h-2 w-2 bg-emerald-500 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          )}

          {showResponse && (
            <div className="flex gap-2 transition-opacity duration-300">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-emerald-600 text-xs font-bold text-white shadow-[0_0_12px_rgba(5,150,105,0.4)]">
                J
              </div>
              <div className="border-l-0 border-l-2 border-emerald-600/30 bg-white/5 px-3 py-2 text-sm text-white/80">
                Here&apos;s your morning plan:
              </div>
            </div>
          )}

          {showTasks && (
            <div className="ml-9 space-y-2">
              {DEMO_TASKS.map((task, i) => (
                <div
                  key={task}
                  className="flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-2 text-sm transition-all duration-300"
                  style={{
                    animationDelay: `${i * 100}ms`,
                    opacity: 1,
                  }}
                >
                  <div
                    className={`h-4 w-4 shrink-0 border transition-colors duration-300 ${
                      completedTask >= i
                        ? "border-emerald-600 bg-emerald-600"
                        : "border-white/20"
                    }`}
                  >
                    {completedTask >= i && (
                      <svg
                        className="h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className={
                      completedTask >= i
                        ? "text-white/30 line-through"
                        : "text-white/70"
                    }
                  >
                    {task}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="border-t border-white/10 p-3">
          <div className="flex items-center border border-white/10 bg-white/5 px-3 py-2">
            <span className="flex-1 text-sm text-white/25">
              Ask Jett to plan your day...
            </span>
            <div className="flex h-7 w-7 items-center justify-center bg-emerald-600 text-white shadow-[0_0_12px_rgba(5,150,105,0.3)]">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14M12 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
