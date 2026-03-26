'use client'
import { useEffect, useState } from 'react'
import type { Analysis } from '@/lib/db/schema'
import Link from 'next/link'

export function HistoryList() {
  const [items, setItems] = useState<Analysis[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/history')
      .then(r => r.json())
      .then(data => { setItems(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="text-stone-500 text-sm font-mono">Loading...</p>
  }

  if (!items.length) {
    return (
      <p className="text-stone-500 text-sm font-mono">
        No analyses yet.{' '}
        <Link href="/" className="text-amber-500 hover:text-amber-400 transition-colors duration-200 cursor-pointer">
          Analyze a repo
        </Link>
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {items.map(a => (
        <Link
          key={a.id}
          href={`/analyze?url=${encodeURIComponent(a.repoUrl)}`}
          className="flex items-center justify-between p-4 bg-[#1c1917] border border-[#292524] hover:border-stone-600 transition-colors duration-200 cursor-pointer block"
        >
          <div className="min-w-0">
            <p className="font-mono text-stone-100 truncate">{a.repoName}</p>
            <p className="text-xs text-stone-500 truncate mt-0.5">{a.repoUrl}</p>
          </div>
          <div className="flex items-center gap-4 shrink-0 ml-4">
            <span className="font-mono text-amber-500 text-sm tabular-nums">{a.score}/100</span>
            <span className="text-xs text-stone-600 hidden sm:block">
              {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : ''}
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
