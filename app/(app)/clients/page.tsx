import { Search, UserSearch } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/layout/page-header'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Table, TableEmpty, TBody, TD, TH, THead, TR } from '@/components/ui/table'
import { listClients } from '@/lib/data'
import { formatDate } from '@/lib/dates'
import { formatNaira } from '@/lib/money'
import { first } from '@/lib/url'

export const metadata: Metadata = { title: 'Clients' }

// /clients, not /customers: the marketing site already owns /customers,
// and two route groups can't serve the same URL.
export default async function ClientsPage({ searchParams }: PageProps<'/clients'>) {
  const q = first((await searchParams).q)?.slice(0, 100) ?? ''
  const clients = await listClients(q)

  return (
    <>
      <PageHeader title="Clients" description="Everyone you bill, with what they owe you." />
      <Card>
        <form action="/clients" role="search" className="flex flex-wrap gap-2 p-4 sm:p-5">
          <div className="relative min-w-0 flex-1 sm:max-w-sm">
            <label htmlFor="client-search" className="sr-only">
              Search clients
            </label>
            <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" />
            <input
              id="client-search"
              name="q"
              type="search"
              defaultValue={q}
              placeholder="Name, contact, city or industry"
              className="h-10 w-full rounded-control border border-line-strong bg-raised pr-3 pl-9 text-sm text-ink placeholder:text-subtle focus-visible:border-brand"
            />
          </div>
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </form>
        <Table caption={`Clients${q ? ` matching “${q}”` : ''}`} captionHidden>
          <THead>
            <TR>
              <TH>Client</TH>
              <TH className="max-md:hidden">Industry</TH>
              <TH className="max-lg:hidden">Last invoice</TH>
              <TH align="right" className="max-sm:hidden">
                Billed
              </TH>
              <TH align="right">Outstanding</TH>
            </TR>
          </THead>
          <TBody>
            {clients.length === 0 ? (
              <TableEmpty colSpan={5}>
                <EmptyState
                  icon={<UserSearch />}
                  title="No clients match"
                  description={`Nothing found for “${q}”.`}
                  action={
                    <Button href="/clients" variant="secondary">
                      Show all clients
                    </Button>
                  }
                />
              </TableEmpty>
            ) : (
              clients.map((c) => (
                <TR key={c.id} className="relative hover:bg-sunken/70 has-focus-visible:bg-sunken/70">
                  <TD>
                    <div className="flex items-center gap-3">
                      <Avatar name={c.name} decorative />
                      <div className="min-w-0">
                        {/* Stretched link: the whole row is clickable, but there's one real link. */}
                        <Link href={`/clients/${c.id}`} className="font-semibold text-ink after:absolute after:inset-0 hover:text-brand">
                          {c.name}
                        </Link>
                        <p className="text-xs text-muted">
                          {c.contactName} · {c.city}
                        </p>
                      </div>
                    </div>
                  </TD>
                  <TD className="text-muted max-md:hidden">{c.industry}</TD>
                  <TD className="whitespace-nowrap text-muted max-lg:hidden">{c.lastInvoiceDate ? formatDate(c.lastInvoiceDate) : '—'}</TD>
                  <TD align="right" className="text-ink max-sm:hidden">
                    {formatNaira(c.billed)}
                  </TD>
                  <TD align="right" className={c.outstanding > 0 ? 'font-semibold text-ink' : 'text-subtle'}>
                    {formatNaira(c.outstanding)}
                  </TD>
                </TR>
              ))
            )}
          </TBody>
        </Table>
        <p className="border-t border-line px-5 py-3 text-sm text-muted">
          {clients.length} client{clients.length === 1 ? '' : 's'}
        </p>
      </Card>
    </>
  )
}
