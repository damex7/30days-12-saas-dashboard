import { FileSearch, Plus } from 'lucide-react'
import type { Metadata } from 'next'
import { InvoiceFilters } from '@/components/app/invoice-filters'
import { InvoiceTable } from '@/components/app/invoice-table'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Pagination } from '@/components/ui/pagination'
import { listInvoices } from '@/lib/data'
import { INVOICE_STATUSES, type InvoiceQuery, type InvoiceStatus, type SortKey } from '@/lib/types'
import { first, hrefWith, type Query } from '@/lib/url'

export const metadata: Metadata = { title: 'Invoices' }

const SORT_KEYS: SortKey[] = ['number', 'client', 'issueDate', 'dueDate', 'total', 'status']

/** Turns raw ?status=&q=&page=&sort=&dir= into a validated query (bad values are ignored). */
function parseQuery(query: Query): InvoiceQuery {
  const status = first(query.status)
  const sort = first(query.sort)
  const dir = first(query.dir)
  const page = Number(first(query.page))
  return {
    status: INVOICE_STATUSES.includes(status as InvoiceStatus) ? (status as InvoiceStatus) : undefined,
    q: first(query.q)?.slice(0, 100),
    page: Number.isInteger(page) && page > 0 ? page : 1,
    sort: SORT_KEYS.includes(sort as SortKey) ? (sort as SortKey) : undefined,
    dir: dir === 'asc' || dir === 'desc' ? dir : undefined,
  }
}

// THE URL IS THE STATE: status, search, sort and page all live in the query
// string. This Server Component reads them (searchParams is a Promise in
// Next.js 15+, so it's awaited), asks lib/data.ts for that slice, and
// renders. No useState anywhere, and every view can be bookmarked or shared.
export default async function InvoicesPage({ searchParams }: PageProps<'/invoices'>) {
  const query = await searchParams
  const parsed = parseQuery(query)
  const result = await listInvoices(parsed)
  const from = (result.page - 1) * result.pageSize + 1
  const to = from + result.items.length - 1
  const filtered = Boolean(parsed.q || parsed.status)

  return (
    <>
      <PageHeader
        title="Invoices"
        description="Everything you’ve billed. Click an invoice for a quick look."
        actions={
          <Button href="/invoices/new">
            <Plus aria-hidden /> New invoice
          </Button>
        }
      />
      <Card>
        <div className="p-4 sm:p-5">
          <InvoiceFilters query={query} counts={result.counts} />
        </div>
        <InvoiceTable
          invoices={result.items}
          sort={parsed.sort ?? 'issueDate'}
          dir={parsed.dir ?? (parsed.sort ? 'asc' : 'desc')}
          hrefForSort={(sort, dir) => hrefWith('/invoices', query, { sort, dir, page: null })}
          empty={
            <EmptyState
              icon={<FileSearch />}
              title={filtered ? 'No invoices match' : 'No invoices yet'}
              description={filtered ? 'Try a different search or status.' : 'Create your first invoice and it will show up here.'}
              action={
                filtered ? (
                  <Button href="/invoices" variant="secondary">
                    Clear filters
                  </Button>
                ) : (
                  <Button href="/invoices/new">New invoice</Button>
                )
              }
            />
          }
        />
        {result.total > 0 && (
          <div className="flex flex-col gap-3 border-t border-line p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            {/* aria-live so screen reader users hear the new count after filtering. */}
            <p className="text-sm text-muted" aria-live="polite">
              Showing <strong className="text-ink">{from}</strong>–<strong className="text-ink">{to}</strong> of{' '}
              <strong className="text-ink">{result.total}</strong>
            </p>
            <Pagination page={result.page} pageCount={result.pageCount} hrefFor={(page) => hrefWith('/invoices', query, { page: page === 1 ? null : page })} />
          </div>
        )}
      </Card>
    </>
  )
}
