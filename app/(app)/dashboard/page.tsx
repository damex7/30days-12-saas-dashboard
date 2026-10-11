import { PartyPopper } from 'lucide-react'
import Link from 'next/link'
import { WhatsAppShareLink } from '@/components/app/whatsapp-link'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { getOverdueInvoices } from '@/lib/data'
import { formatDate } from '@/lib/dates'
import { formatNaira } from '@/lib/money'

// THE IMPLICIT `children` SLOT of dashboard/layout.tsx. A parallel route's
// page.tsx is just the `children` slot, next to @stats, @revenue and
// @activity. It has its own loading.tsx too.

export default async function OverdueToChase() {
  const overdue = await getOverdueInvoices()

  return (
    <Card>
      <CardHeader
        title="Overdue invoices to chase"
        description="Oldest first. A friendly nudge on WhatsApp usually does it."
        actions={
          overdue.length > 0 && (
            <Button href="/invoices?status=overdue" variant="ghost" size="sm">
              View all
            </Button>
          )
        }
      />
      {overdue.length === 0 ? (
        <EmptyState icon={<PartyPopper />} title="Nothing overdue" description="Every sent invoice is paid or still within its due date." />
      ) : (
        <ul className="mt-4 divide-y divide-line border-t border-line">
          {overdue.map((inv) => (
            <li key={inv.id} className="flex flex-wrap items-center gap-x-4 gap-y-3 px-5 py-4">
              <Avatar name={inv.client.name} decorative />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">{inv.client.name}</p>
                <p className="text-sm text-muted">
                  <Link href={`/invoices/${inv.id}`} className="font-mono text-xs font-semibold text-brand hover:underline">
                    {inv.id}
                  </Link>{' '}
                  · due {formatDate(inv.dueDate)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-ink tabular-nums">{formatNaira(inv.total)}</p>
                <Badge tone="overdue">{inv.daysOverdue} days late</Badge>
              </div>
              <WhatsAppShareLink invoice={inv} kind="reminder" size="sm" label="Chase" className="max-sm:w-full" />
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
