import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'
import { statusLabel } from '@/lib/invoices'
import type { InvoiceStatus } from '@/lib/types'

/**
 * Badge: a small label for a status or category.
 * Tones map to tokens, so "paid" is the same green in the table, the modal,
 * the dashboard and the /ui page.
 */
export const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-pill px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap',
  {
    variants: {
      tone: {
        neutral: 'bg-sunken text-muted',
        brand: 'bg-brand-soft text-brand-strong',
        accent: 'bg-accent-soft text-ink',
        paid: 'bg-paid-soft text-paid',
        sent: 'bg-sent-soft text-sent',
        overdue: 'bg-overdue-soft text-overdue',
        draft: 'bg-draft-soft text-draft',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
)

export function Badge({ tone, className, ...props }: ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return <span {...props} className={cn(badgeVariants({ tone }), className)} />
}

/**
 * The invoice status badge. Each status has a different dot SHAPE as well as
 * colour (draft hollow, sent half, paid filled, overdue a warning mark) and
 * always the word, so it reads correctly for colour-blind users and in print.
 */
export function InvoiceStatusBadge({ status, className }: { status: InvoiceStatus; className?: string }) {
  return (
    <Badge tone={status} className={className}>
      <StatusDot status={status} />
      {statusLabel[status]}
    </Badge>
  )
}

function StatusDot({ status }: { status: InvoiceStatus }) {
  const common = { 'aria-hidden': true, viewBox: '0 0 10 10', className: 'size-2.5' } as const
  switch (status) {
    case 'draft':
      return (
        <svg {...common}>
          <circle cx="5" cy="5" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 1.5" />
        </svg>
      )
    case 'sent':
      return (
        <svg {...common}>
          <circle cx="5" cy="5" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M5 1.5a3.5 3.5 0 0 1 0 7z" fill="currentColor" />
        </svg>
      )
    case 'paid':
      return (
        <svg {...common}>
          <circle cx="5" cy="5" r="4" fill="currentColor" />
        </svg>
      )
    case 'overdue':
      return (
        <svg {...common}>
          <path d="M5 .8 9.4 9H.6z" fill="currentColor" />
        </svg>
      )
  }
}
