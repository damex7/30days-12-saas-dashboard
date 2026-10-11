import { Search, X } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LinkTabs } from '@/components/ui/link-tabs'
import { statusLabel } from '@/lib/invoices'
import type { InvoicePage, InvoiceStatus } from '@/lib/types'
import { hrefWith, type Query } from '@/lib/url'

/**
 * InvoiceFilters: status tabs + search, with ALL state in the URL.
 *
 * - The status tabs are links (?status=paid) built from the current query,
 *   so switching status keeps your search and resets to page 1.
 * - The search box is a plain GET <form>: pressing Enter loads
 *   /invoices?q=…&status=…. No client JavaScript, no useState, and the
 *   Back button, refresh and shared links all just work.
 * A Server Component: it's told the current query and builds links from it.
 */
export function InvoiceFilters({ query, counts }: { query: Query; counts: InvoicePage['counts'] }) {
  const status = typeof query.status === 'string' ? query.status : undefined
  const q = typeof query.q === 'string' ? query.q : ''
  const tabs = (['all', 'draft', 'sent', 'overdue', 'paid'] as const).map((key) => ({
    key,
    label: key === 'all' ? 'All' : statusLabel[key as InvoiceStatus],
    count: counts[key],
    href: hrefWith('/invoices', query, { status: key === 'all' ? null : key, page: null }),
  }))

  return (
    <div className="flex flex-col gap-4">
      <form action="/invoices" role="search" className="flex flex-wrap items-center gap-2">
        {/* Keep the active status (and sort) when searching. */}
        {status && <input type="hidden" name="status" value={status} />}
        {typeof query.sort === 'string' && <input type="hidden" name="sort" value={query.sort} />}
        {typeof query.dir === 'string' && <input type="hidden" name="dir" value={query.dir} />}
        <div className="relative min-w-0 flex-1 sm:max-w-sm">
          <label htmlFor="invoice-search" className="sr-only">
            Search invoices
          </label>
          <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" />
          <input
            id="invoice-search"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Invoice number, client or item"
            className="h-10 w-full rounded-control border border-line-strong bg-raised pr-3 pl-9 text-sm text-ink placeholder:text-subtle focus-visible:border-brand"
          />
        </div>
        <Button type="submit" variant="secondary">
          Search
        </Button>
        {q && (
          <Link href={hrefWith('/invoices', query, { q: null, page: null })} className="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-ink">
            <X aria-hidden className="size-4" /> Clear “{q}”
          </Link>
        )}
      </form>
      <LinkTabs label="Filter by status" items={tabs} current={status ?? 'all'} />
    </div>
  )
}
