import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Page numbers to show: first, last, and a window around the current page, with gaps. */
function pageList(page: number, pageCount: number): (number | 'gap')[] {
  const pages = new Set([1, pageCount, page - 1, page, page + 1].filter((p) => p >= 1 && p <= pageCount))
  const sorted = [...pages].sort((a, b) => a - b)
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? ['gap' as const, p] : [p]))
}

const cell =
  'inline-grid h-9 min-w-9 place-items-center rounded-control px-2 text-sm font-semibold tabular-nums transition-colors'

/**
 * Pagination: links, not buttons, because each page is a URL (?page=3).
 * The caller passes `hrefFor`, so Pagination doesn't need to know which
 * other params (status, search, sort) to keep. The invoice list builds
 * those links with hrefWith().
 */
export function Pagination({
  page,
  pageCount,
  hrefFor,
  className,
}: {
  page: number
  pageCount: number
  hrefFor: (page: number) => string
  className?: string
}) {
  if (pageCount <= 1) return null
  return (
    <nav aria-label="Pagination" className={cn('flex items-center justify-between gap-2', className)}>
      <PageLink href={page > 1 ? hrefFor(page - 1) : undefined} label="Previous">
        <ChevronLeft aria-hidden className="size-4" />
        <span className="hidden sm:inline">Previous</span>
      </PageLink>
      <ul className="flex items-center gap-1">
        {pageList(page, pageCount).map((p, i) =>
          p === 'gap' ? (
            <li key={`gap-${i}`} aria-hidden className="px-1 text-muted">
              …
            </li>
          ) : (
            <li key={p}>
              <Link
                href={hrefFor(p)}
                aria-current={p === page ? 'page' : undefined}
                aria-label={`Page ${p}`}
                className={cn(cell, p === page ? 'bg-brand text-brand-ink' : 'text-muted hover:bg-sunken hover:text-ink')}
              >
                {p}
              </Link>
            </li>
          ),
        )}
      </ul>
      <PageLink href={page < pageCount ? hrefFor(page + 1) : undefined} label="Next">
        <span className="hidden sm:inline">Next</span>
        <ChevronRight aria-hidden className="size-4" />
      </PageLink>
    </nav>
  )
}

function PageLink({ href, label, children }: { href?: string; label: string; children: ReactNode }) {
  const cls = cn(cell, 'gap-1 border border-line px-3')
  // On the first/last page the control is shown but disabled, so the layout doesn't shift.
  if (!href)
    return (
      <span aria-disabled="true" aria-label={label} className={cn(cls, 'flex text-subtle opacity-60')}>
        {children}
      </span>
    )
  return (
    <Link href={href} aria-label={label} className={cn(cls, 'flex text-ink hover:bg-sunken')}>
      {children}
    </Link>
  )
}
