'use client'
import { useAuth, UserButton, SignInButton } from '@clerk/nextjs'

export function NavAuth() {
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-4">
        <a
          href="/dashboard"
          className="text-sm text-stone-400 hover:text-stone-100 transition-colors duration-200"
        >
          Dashboard
        </a>
        <UserButton />
      </div>
    )
  }

  return (
    <SignInButton>
      <button className="text-sm text-stone-400 hover:text-stone-100 transition-colors duration-200 cursor-pointer">
        Sign in
      </button>
    </SignInButton>
  )
}
