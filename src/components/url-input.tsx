'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function UrlInput() {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!url.includes('github.com')) {
      setError('Enter a valid GitHub URL (github.com/user/repo)')
      return
    }
    router.push(`/analyze?url=${encodeURIComponent(url)}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-xl">
      <div className="flex gap-2">
        <Input
          value={url}
          onChange={e => { setUrl(e.target.value); setError('') }}
          placeholder="github.com/you/your-repo"
          className="bg-stone-950 border-stone-800 text-stone-100 font-mono placeholder:text-stone-600 focus-visible:ring-amber-500/50 focus-visible:border-amber-500"
        />
        <Button
          type="submit"
          className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold shrink-0 cursor-pointer transition-colors duration-200"
        >
          <ArrowRight className="w-4 h-4" />
          <span>Analyze</span>
        </Button>
      </div>
      {error && (
        <p className="text-red-400 text-sm font-mono" role="alert">{error}</p>
      )}
    </form>
  )
}
