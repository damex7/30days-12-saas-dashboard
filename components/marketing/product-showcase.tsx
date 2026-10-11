import { AlertTriangle, Wallet } from 'lucide-react'
import { RevenueChart } from '@/components/app/revenue-chart'
import { StatCard } from '@/components/app/stat-card'
import { Avatar } from '@/components/ui/avatar'
import { InvoiceStatusBadge } from '@/components/ui/badge'
import { Card, CardHeader } from '@/components/ui/card'
import { LogoMark } from '@/components/layout/logo'
import { getShowcase } from '@/lib/data'
import { formatNaira } from '@/lib/money'

/**
 * The landing page's "screenshot", built from the REAL app components
 * (StatCard, RevenueChart, Card, Badge, Avatar) fed with cached sample data.
 * It can never go out of date the way an image does, and it is themed: it
 * follows dark mode like the rest of the page.
 *
 * It's a picture of the product, so it is exposed to screen readers as one
 * image with a description (role="img" + aria-label), and `inert` keeps
 * keyboard focus out of it.
 */
export async function ProductShowcase() {
  const data = await getShowcase()
  return (
    <div
      role="img"
      aria-label="Preview of the Owó dashboard: revenue and overdue totals, a 12-month revenue chart, and a list of recent invoices with their status."
      inert
      className="relative rounded-[1.25rem] border border-line bg-surface p-2 shadow-pop sm:p-3"
    >
      {/* Fake window chrome */}
      <div className="flex items-center gap-1.5 px-2 pt-1 pb-3">
        <span className="size-2.5 rounded-pill bg-overdue/60" />
        <span className="size-2.5 rounded-pill bg-accent/80" />
        <span className="size-2.5 rounded-pill bg-paid/60" />
        <span className="ml-3 hidden rounded-pill bg-sunken px-3 py-0.5 text-[0.6875rem] text-subtle sm:inline">Owó · Dashboard</span>
      </div>
      <div className="grid grid-cols-1 gap-3 rounded-card bg-sunken p-3 sm:p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <StatCard label="Collected last month" value={formatNaira(data.collected)} icon={<Wallet />} change={{ current: data.collected, previous: data.previousCollected, higherIsBetter: true, unit: 'percent' }} />
          <StatCard label="Overdue" value={formatNaira(data.overdue)} icon={<AlertTriangle />} hint="Reminders are already on it" />
        </div>
        <Card className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <LogoMark className="size-5" />
            <p className="text-sm font-bold text-ink">Revenue, last 12 months</p>
          </div>
          <RevenueChart months={data.months} compact />
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader title="Recent invoices" level={3} className="pb-2" />
          <ul className="divide-y divide-line px-5 pb-3">
            {data.recent.map((inv) => (
              <li key={inv.id} className="flex items-center gap-3 py-2.5 text-sm">
                <Avatar name={inv.client.name} size="sm" decorative />
                <span className="min-w-0 flex-1 truncate font-medium text-ink">{inv.client.name}</span>
                <span className="hidden font-mono text-xs text-subtle sm:inline">{inv.id}</span>
                <span className="font-semibold text-ink tabular-nums">{formatNaira(inv.total)}</span>
                <InvoiceStatusBadge status={inv.status} className="hidden xs:inline-flex" />
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
