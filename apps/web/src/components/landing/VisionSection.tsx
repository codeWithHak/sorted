const futureAgents = [
  { name: "Aria", role: "Calendar Agent", color: "sky" },
  { name: "Flux", role: "Notes Agent", color: "violet" },
  { name: "Pulse", role: "Habits Agent", color: "emerald" },
];

export function VisionSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight text-stone-900">
          Jett is just the first.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-stone-500">
          The Sorted Universe is growing. New agents are being built — each
          with their own specialty, their own personality, their own way of
          helping you stay on top of life.
        </p>
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {futureAgents.map((agent) => (
            <div
              key={agent.name}
              className="group relative rounded-2xl border border-stone-200 bg-white p-6 text-center transition-all hover:shadow-lg hover:shadow-amber-500/5"
            >
              <div className="mx-auto h-16 w-16 rounded-full bg-stone-100" />
              <h3 className="mt-4 font-semibold text-stone-400">{agent.name}</h3>
              <p className="text-sm text-stone-400">{agent.role}</p>
              <span className="mt-3 inline-block rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-400">
                coming soon
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
