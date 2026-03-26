import { UserButton } from '@clerk/nextjs'
import { HistoryList } from '@/components/history-list'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#0c0a09] text-stone-100 p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-mono text-xs text-stone-500 uppercase tracking-widest mb-1">
              02 / History
            </p>
            <h1 className="text-2xl font-bold tracking-tight">Your analyses</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-stone-400 hover:text-stone-100 transition-colors duration-200 cursor-pointer font-mono"
            >
              ← New analysis
            </Link>
            <UserButton />
          </div>
        </div>
        <HistoryList />
      </div>
    </main>
  )
}
