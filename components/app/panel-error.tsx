// CLIENT COMPONENT: rendered by error.tsx files, which must be Client
// Components (error boundaries are a client-side React feature).
'use client'

import { RotateCw, TriangleAlert } from 'lucide-react'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/cn'

/**
 * The fallback for one failed panel. It fills the panel's own space, so the
 * rest of the page (the other dashboard panels, the sidebar) stays usable.
 * `retry()` comes from Next.js: it re-fetches and re-renders just this
 * segment, so a temporary failure can recover without a page reload.
 */
export function PanelError({
  title,
  error,
  retry,
  className,
}: {
  title: string
  error: Error & { digest?: string }
  retry: () => void
  className?: string
}) {
  useEffect(() => {
    // A real app would report this to an error tracker.
    console.error(error)
  }, [error])

  return (
    <Card role="alert" className={cn('flex flex-col items-start gap-3 border-overdue/40 bg-overdue-soft/40 p-5', className)}>
      <span className="flex items-center gap-2 font-semibold text-ink">
        <TriangleAlert aria-hidden className="size-5 text-overdue" />
        {title}
      </span>
      <p className="text-sm text-muted">
        This panel couldn’t load. The rest of the page is fine.
        {error.digest && <span className="block font-mono text-xs text-subtle">Reference: {error.digest}</span>}
        {process.env.NODE_ENV === 'development' && <span className="block text-xs text-subtle">{error.message}</span>}
      </p>
      <Button variant="secondary" size="sm" onClick={() => retry()}>
        <RotateCw aria-hidden /> Try again
      </Button>
    </Card>
  )
}
