export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-4 p-8 font-sans">
      <h1 className="text-3xl font-semibold tracking-tight">sorted</h1>
      <p className="text-zinc-600">
        Phase II scaffold: Next.js (apps/web) + FastAPI (services/api)
      </p>
      <p className="text-zinc-600">
        API proxy target is configured via <code>API_BASE_URL</code>.
      </p>
    </main>
  );
}
