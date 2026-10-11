import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * Skeleton: a grey placeholder block with a soft shimmer.
 *
 * Skeletons should match the SHAPE of the real content (same heights, same
 * grid), so when data arrives nothing jumps. Size each one with classes:
 * <Skeleton className="h-4 w-32" />. They are aria-hidden: a row of grey
 * boxes means nothing to a screen reader. <LoadingRegion> announces
 * "Loading…" once for the whole group instead.
 */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn('skeleton-shimmer rounded-control', className)} />
}

/** Wraps a group of skeletons and tells assistive tech what is loading. */
export function LoadingRegion({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <div role="status" aria-live="polite" className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  )
}
