import { UrlInput } from '@/components/url-input'
import { NavAuth } from '@/components/nav-auth'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0c0a09] text-stone-100 flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-stone-900/60">
        <span className="font-mono text-sm font-semibold tracking-tight text-stone-300">
          repo<span className="text-amber-500">ready</span>
        </span>
        <NavAuth />
      </nav>

      {/* Hero */}
      <section className="flex flex-1 items-center px-6 max-w-6xl mx-auto w-full gap-12 py-16 lg:py-20">
        {/* Left */}
        <div className="flex-1 flex flex-col gap-8 min-w-0">
          <div>
            <p className="font-mono text-xs text-stone-500 uppercase tracking-widest mb-5">
              01 / Repository Analysis
            </p>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Your repo,{' '}
              <span className="text-amber-500">documented.</span>
            </h1>
            <p className="mt-4 text-stone-400 text-lg leading-relaxed max-w-md">
              Paste a GitHub URL. Get a complete README, .env.example,
              docker&#8209;compose, and CI config — generated from your actual code.
            </p>
          </div>
          <UrlInput />
          <p className="text-xs text-stone-600 font-mono">
            12,400 repos analyzed · avg 28s
          </p>
        </div>

        {/* Right — terminal preview */}
        <div className="flex-1 hidden lg:block shrink-0 max-w-sm xl:max-w-md">
          <div
            className="bg-[#080706] border border-stone-900 shadow-2xl motion-safe:-rotate-1"
            aria-hidden="true"
          >
            {/* Terminal chrome */}
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-stone-900">
              <div className="w-3 h-3 rounded-full bg-stone-800" />
              <div className="w-3 h-3 rounded-full bg-stone-800" />
              <div className="w-3 h-3 rounded-full bg-stone-800" />
              <span className="ml-2 text-xs text-stone-600 font-mono">repoready</span>
            </div>
            {/* Terminal output */}
            <div className="p-5 font-mono text-sm space-y-1.5">
              <p className="text-stone-600">$ repoready analyze github.com/you/repo</p>
              <p className="text-stone-400">✓ Repo fetched — 47 files</p>
              <p className="text-stone-400">✓ Stack: Next.js, TypeScript, Clerk</p>
              <p className="text-amber-500">→ Generating README.md...</p>
              <p className="text-amber-500">→ Generating .env.example...</p>
              <p className="text-amber-500">→ Generating docker-compose.yml...</p>
              <p className="text-amber-500">→ Generating ci.yml...</p>
              <p className="text-stone-300 mt-3 border-t border-stone-900 pt-3">
                Ready to download ↓
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 max-w-6xl mx-auto w-full pb-16 lg:pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              n: '01',
              title: 'Real analysis',
              desc: 'Reads your actual code — not a template filler.',
            },
            {
              n: '02',
              title: '4 files, 30 seconds',
              desc: 'README, .env, docker-compose, CI — all at once.',
            },
            {
              n: '03',
              title: 'Stream & download',
              desc: 'Watch it generate live, then grab a ZIP.',
            },
          ].map(f => (
            <div
              key={f.n}
              className="border border-[#292524] bg-[#1c1917] p-6"
            >
              <p className="font-mono text-amber-500 text-xs mb-3 tabular-nums">{f.n}</p>
              <h3 className="font-semibold text-stone-100 mb-2">{f.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
