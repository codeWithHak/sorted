"use client";

export function HeroSection() {
  function scrollToMeetJett() {
    document.getElementById("meet-jett")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="mx-auto max-w-4xl px-6 pb-24 pt-20 text-center">
      <h1 className="text-5xl font-bold tracking-tight text-stone-900 sm:text-6xl lg:text-7xl">
        A universe of agents{" "}
        <br className="hidden sm:inline" />
        that work for you.
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-500">
        Meet the agents of the Sorted Universe. They listen, they act, they
        learn. Start with Jett — your task agent — and watch your world get
        sorted.
      </p>
      <div className="mt-8 flex items-center justify-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <div className="h-10 w-10 rounded-full bg-amber-500 ring-2 ring-white flex items-center justify-center text-white font-bold text-sm">
              J
            </div>
            <div className="h-10 w-10 rounded-full bg-stone-300 ring-2 ring-white" />
            <div className="h-10 w-10 rounded-full bg-stone-200 ring-2 ring-white" />
            <div className="h-10 w-10 rounded-full bg-stone-100 ring-2 ring-white" />
          </div>
        </div>
      </div>
      <div className="mt-10">
        <button
          onClick={scrollToMeetJett}
          className="rounded-full bg-amber-500 px-8 py-3 text-base font-medium text-white hover:bg-amber-600 transition-colors"
        >
          Meet your first agent
        </button>
      </div>
    </section>
  );
}
