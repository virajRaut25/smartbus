export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900">
            SmartBus
          </h1>

          <p className="mt-4 text-lg text-slate-600">
            AI-powered bus reservation platform
          </p>

          <button className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700">
            Search Buses
          </button>
        </div>
      </section>
    </main>
  );
}
