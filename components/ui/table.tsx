import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * Table primitives: thin, styled wrappers around real <table> elements.
 *
 * Design:
 * - A real table (not a grid of divs) so screen readers can announce
 *   "row 3 of 10, column Amount" and users can navigate by cell.
 * - The wrapper scrolls sideways on small screens instead of squashing
 *   columns, and is focusable so keyboard users can scroll it too.
 * - A <caption> names the table (visible or sr-only).
 * - Sorting lives in the URL (<SortableHeader> renders links), so a sorted
 *   view survives refresh and needs no client JavaScript.
 */
export function Table({ caption, captionHidden, className, children }: { caption: ReactNode; captionHidden?: boolean; className?: string; children: ReactNode }) {
  return (
    // role="region" + aria-label + tabIndex lets keyboard users scroll a wide table.
    <div role="region" aria-label={typeof caption === 'string' ? caption : undefined} tabIndex={0} className={cn('overflow-x-auto', className)}>
      <table className="w-full border-collapse text-left text-sm">
        <caption className={cn('pb-3 text-left font-semibold text-ink', captionHidden && 'sr-only')}>{caption}</caption>
        {children}
      </table>
    </div>
  )
}

export function THead({ className, ...props }: ComponentProps<'thead'>) {
  return <thead {...props} className={cn('border-y border-line bg-sunken text-xs tracking-wide text-muted uppercase', className)} />
}

export function TBody({ className, ...props }: ComponentProps<'tbody'>) {
  return <tbody {...props} className={cn('divide-y divide-line', className)} />
}

export function TR({ className, ...props }: ComponentProps<'tr'>) {
  return <tr {...props} className={cn('transition-colors', className)} />
}

export function TH({ className, align, ...props }: ComponentProps<'th'> & { align?: 'left' | 'right' }) {
  return <th scope="col" {...props} className={cn('px-4 py-2.5 font-semibold whitespace-nowrap', align === 'right' && 'text-right', className)} />
}

export function TD({ className, align, ...props }: ComponentProps<'td'> & { align?: 'left' | 'right' }) {
  return <td {...props} className={cn('px-4 py-3 align-middle', align === 'right' && 'text-right tabular-nums', className)} />
}

/**
 * A column header that sorts the table by linking to the same page with
 * ?sort=key&dir=asc|desc. `aria-sort` tells screen readers the current order.
 * Clicking the active column flips direction; another column starts ascending.
 */
export function SortableHeader({
  label,
  sortKey,
  currentSort,
  currentDir,
  hrefFor,
  align,
  className,
}: {
  label: string
  sortKey: string
  currentSort?: string
  currentDir?: 'asc' | 'desc'
  hrefFor: (sort: string, dir: 'asc' | 'desc') => string
  align?: 'left' | 'right'
  className?: string
}) {
  const active = currentSort === sortKey
  const nextDir = active && currentDir === 'asc' ? 'desc' : 'asc'
  const Icon = !active ? ArrowUpDown : currentDir === 'asc' ? ArrowUp : ArrowDown
  return (
    <TH
      align={align}
      aria-sort={active ? (currentDir === 'asc' ? 'ascending' : 'descending') : undefined}
      className={cn('p-0', className)}
    >
      <Link
        href={hrefFor(sortKey, nextDir)}
        scroll={false}
        className={cn(
          'inline-flex w-full items-center gap-1.5 px-4 py-2.5 hover:text-ink',
          align === 'right' && 'justify-end',
          active && 'text-ink',
        )}
      >
        {label}
        <Icon aria-hidden className={cn('size-3.5', !active && 'opacity-50')} />
        <span className="sr-only">, sort {nextDir === 'asc' ? 'ascending' : 'descending'}</span>
      </Link>
    </TH>
  )
}

/** One full-width row for "nothing here". Put an <EmptyState> inside. */
export function TableEmpty({ colSpan, children }: { colSpan: number; children: ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan}>{children}</td>
    </tr>
  )
}
