import { Bell, CheckCircle2, Eye, FilePlus2, Send, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/cn'
import { formatRelative } from '@/lib/dates'
import { formatNaira } from '@/lib/money'
import type { ActivityItem, ActivityType, ISODate } from '@/lib/types'

const meta: Record<ActivityType, { icon: LucideIcon; verb: string; tone: string }> = {
  paid: { icon: CheckCircle2, verb: 'paid', tone: 'bg-paid-soft text-paid' },
  viewed: { icon: Eye, verb: 'viewed', tone: 'bg-sent-soft text-sent' },
  sent: { icon: Send, verb: 'was sent', tone: 'bg-brand-soft text-brand' },
  reminder: { icon: Bell, verb: 'was reminded about', tone: 'bg-overdue-soft text-overdue' },
  created: { icon: FilePlus2, verb: 'Draft created for', tone: 'bg-draft-soft text-draft' },
}

/**
 * ActivityFeed: a timeline of what happened to your invoices.
 * Pure presentation: it receives the items and "today" (for "3 days ago"),
 * so it can't disagree with the server about what day it is.
 */
export function ActivityFeed({ items, today, className }: { items: ActivityItem[]; today: ISODate; className?: string }) {
  return (
    <ol className={cn('relative space-y-4', className)}>
      {items.map((item) => {
        const { icon: Icon, verb, tone } = meta[item.type]
        return (
          <li key={item.id} className="flex gap-3">
            <span aria-hidden className={cn('grid size-8 shrink-0 place-items-center rounded-pill', tone)}>
              <Icon className="size-4" />
            </span>
            <div className="min-w-0 flex-1 text-sm">
              <p className="text-ink">
                {item.type === 'created' ? (
                  <>
                    {verb} <strong className="font-semibold">{item.clientName}</strong>
                  </>
                ) : (
                  <>
                    <strong className="font-semibold">{item.clientName}</strong> {verb}{' '}
                  </>
                )}{' '}
                <Link href={`/invoices/${item.invoiceId}`} className="font-mono text-xs font-semibold text-brand hover:underline">
                  {item.invoiceId}
                </Link>
              </p>
              <p className="text-xs text-muted">
                {formatNaira(item.amount)} · <time dateTime={item.date}>{formatRelative(item.date, today)}</time>
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
