// ROOT ERROR BOUNDARY: catches errors in the marketing, auth and /ui
// pages. It renders inside the root layout (fonts, theme, toasts still
// work); only an error in the root layout itself falls through to
// global-error.tsx.
'use client'

import { RotateCw } from 'lucide-react'
import { useEffect } from 'react'
import { Logo } from '@/components/layout/logo'
import { Button } from '@/components/ui/button'

export default function RootError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-dvh flex-col px-gutter py-6 sm:px-gutter-lg">
      <Logo />
      <main id="main" tabIndex={-1} role="alert" className="flex flex-1 flex-col items-center justify-center text-center focus:outline-none">
        <h1 className="text-3xl font-extrabold text-ink">Something went wrong</h1>
        <p className="mt-3 max-w-md text-muted">Sorry about that. Please try again.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={() => retry()}>
            <RotateCw aria-hidden /> Try again
          </Button>
          <Button href="/" variant="secondary">
            Home page
          </Button>
        </div>
      </main>
    </div>
  )
}
