import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type LinkTab = { key: string; href: string; label: ReactNode; count?: number }

/**
 * LinkTabs: tabs that are separate URLs (Settings sections, invoice status
 * filters). They are NAVIGATION, so they're a <nav> of real links with
 * aria-current, not an ARIA tablist: you can open one in a new tab, share
 * it, and the Back button works.
 *
 * It's a Server Component that is TOLD which tab is current. Whoever
 * renders it decides how to know that: the invoice list reads it from
 * searchParams on the server; the settings layout (which can't see the URL)
 * wraps it in a tiny client component that uses useSelectedLayoutSegment().
 */
export function LinkTabs({
  items,
  current,
  label,
  className,
}: {
  items: LinkTab[]
  current: string | null
  label: string
  className?: string
}) {
  return (
    <nav aria-label={label} className={cn('relative -mx-1 overflow-x-auto', className)}>
      <ul className="flex min-w-max gap-1 border-b border-line px-1">
        {items.map((tab) => {
          const active = tab.key === current
          return (
            <li key={tab.key}>
              <Link
                href={tab.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  '-mb-px flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors',
                  active ? 'border-brand text-ink' : 'border-transparent text-muted hover:border-line-strong hover:text-ink',
                )}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={cn(
                      'rounded-pill px-1.5 py-px text-xs tabular-nums',
                      active ? 'bg-brand text-brand-ink' : 'bg-sunken text-muted',
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
