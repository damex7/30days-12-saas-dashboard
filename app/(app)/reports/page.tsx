import { Clock, Landmark, Receipt, Wallet } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { RevenueChart } from '@/components/app/revenue-chart'
import { StatCard } from '@/components/app/stat-card'
import { PageHeader } from '@/components/layout/page-header'
import { InvoiceStatusBadge } from '@/components/ui/badge'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { getReports } from '@/lib/data'
import { formatNaira } from '@/lib/money'

export const metadata: Metadata = { title: 'Reports' }

const statusBar = { paid: 'bg-paid', sent: 'bg-sent', overdue: 'bg-overdue', draft: 'bg-draft' } as const

// Reports: no new components, only new arrangements of existing ones.
// That's the payoff of building the library first.
export default async function ReportsPage() {
  const r = await getReports()
  const totalCount = r.statusBreakdown.reduce((n, s) => n + s.count, 0)
  const topBilled = r.topClients[0]?.billed || 1

  return (
    <>
      <PageHeader title="Reports" description="The last 12 months at a glance. Figures include VAT unless noted." />
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Collected" value={formatNaira(r.totalCollected)} icon={<Wallet />} hint="Paid in the last 12 months" />
          <StatCard label="Invoiced" value={formatNaira(r.totalInvoiced)} icon={<Receipt />} hint="Sent in the last 12 months" />
          <StatCard label="VAT charged" value={formatNaira(r.vatCharged)} icon={<Landmark />} hint="7.5% on invoices with VAT" />
          <StatCard label="Average time to pay" value={`${r.avgDaysToPay} days`} icon={<Clock />} hint="From issue date to payment" />
        </div>

        <Card>
          <CardHeader title="Invoiced vs collected" description="By month" />
          <CardBody>
            <RevenueChart months={r.months} />
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card as="section" aria-labelledby="top-clients">
            <CardHeader title="Top clients" description="By amount billed" id="top-clients" />
            <CardBody>
              <ol className="space-y-4">
                {r.topClients.map((c, i) => (
                  <li key={c.id}>
                    <div className="flex items-baseline justify-between gap-3 text-sm">
                      <Link href={`/clients/${c.id}`} className="truncate font-semibold text-ink hover:text-brand hover:underline">
                        <span className="mr-2 text-subtle tabular-nums">{i + 1}.</span>
                        {c.name}
                      </Link>
                      <span className="font-semibold text-ink tabular-nums">{formatNaira(c.billed)}</span>
                    </div>
                    {/* A plain CSS bar: its width is the share of the top client. */}
                    <div aria-hidden className="mt-1.5 h-2 rounded-pill bg-sunken">
                      <div className="h-full rounded-pill bg-brand" style={{ width: `${(c.billed / topBilled) * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ol>
            </CardBody>
          </Card>

          <Card as="section" aria-labelledby="by-status">
            <CardHeader title="Invoices by status" description={`${totalCount} invoices in total`} id="by-status" />
            <CardBody>
              <div aria-hidden className="flex h-3 overflow-hidden rounded-pill bg-sunken">
                {r.statusBreakdown.map((s) => (
                  <div key={s.status} className={statusBar[s.status]} style={{ width: `${(s.count / totalCount) * 100}%` }} />
                ))}
              </div>
              <ul className="mt-5 divide-y divide-line">
                {r.statusBreakdown.map((s) => (
                  <li key={s.status} className="flex items-center justify-between gap-3 py-3 text-sm">
                    <InvoiceStatusBadge status={s.status} />
                    <span className="text-muted">
                      {s.count} invoice{s.count === 1 ? '' : 's'}
                    </span>
                    <span className="ml-auto font-semibold text-ink tabular-nums">{formatNaira(s.amount)}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  )
}
