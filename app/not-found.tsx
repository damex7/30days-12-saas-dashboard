import { Compass } from 'lucide-react'
import type { Metadata } from 'next'
import { Logo } from '@/components/layout/logo'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Page not found' }

// ROOT NOT FOUND: any URL that matches no route at all (/pricng, /foo).
// It renders inside the ROOT layout only, not inside a route group, so it
// brings its own minimal chrome (the logo) instead of the marketing header
// or the app sidebar. More specific not-found.tsx files (invoices/[id],
// clients/[id]) handle "this invoice doesn't exist" inside the app shell.
export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col px-gutter py-6 sm:px-gutter-lg">
      <header>
        <Logo />
      </header>
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col items-center justify-center text-center focus:outline-none">
        <span aria-hidden className="grid size-14 place-items-center rounded-card bg-brand-soft text-brand">
          <Compass className="size-7" />
        </span>
        <p className="mt-6 font-mono text-sm font-semibold text-muted">404</p>
        <h1 className="mt-2 text-3xl font-extrabold text-ink sm:text-4xl">This page went missing</h1>
        <p className="mt-3 max-w-md text-muted">The link may be old or mistyped. Let’s get you back somewhere useful.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/">Go to the home page</Button>
          <Button href="/dashboard" variant="secondary">
            Open your dashboard
          </Button>
        </div>
      </main>
    </div>
  )
}
