import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import type { ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/cn'
import { formatNaira } from '@/lib/money'
import type { Stat } from '@/lib/types'

type Change = { current: number; previous: number; higherIsBetter: boolean; unit: 'percent' | 'points' }

/** Works out the arrow, the wording and whether the change is good news. */
function describeChange({ current, previous, higherIsBetter, unit }: Change) {
  const diff = current - previous
  const direction = diff === 0 ? 'flat' : diff > 0 ? 'up' : 'down'
  let amount: string
  if (unit === 'points') amount = `${Math.abs(diff)} pts`
  else if (previous === 0) amount = current === 0 ? '0%' : 'new'
  else amount = `${Math.abs(Math.round((diff / previous) * 100))}%`
  const good = direction === 'flat' ? null : (direction === 'up') === higherIsBetter
  return { direction, amount, good } as const
}

/**
 * StatCard: one headline number with how it moved since last month.
 *
 * Design:
 * - The change shows an ARROW + WORDS + colour. Colour alone would fail for
 *   colour-blind users; and "good" isn't always "up": overdue going up is
 *   bad, so the card takes `higherIsBetter` instead of assuming.
 * - `value` is a ReactNode slot (already formatted), so the card works for
 *   money, percentages or counts; `icon` is a slot too.
 * - A Server Component with no data fetching of its own: the dashboard
 *   and the landing page's product preview both feed it.
 */
export function StatCard({
  label,
  value,
  change,
  hint,
  icon,
  className,
}: {
  label: string
  value: ReactNode
  change?: Change
  hint?: ReactNode
  icon?: ReactNode
  className?: string
}) {
  const c = change && describeChange(change)
  const Arrow = c?.direction === 'up' ? ArrowUpRight : c?.direction === 'down' ? ArrowDownRight : Minus

  return (
    <Card className={cn('flex flex-col gap-3 p-5', className)}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-sans text-sm font-semibold tracking-normal text-muted">{label}</h3>
        {icon && (
          <span aria-hidden className="grid size-8 place-items-center rounded-control bg-brand-soft text-brand [&_svg]:size-4">
            {icon}
          </span>
        )}
      </div>
      <p className="font-display text-2xl font-extrabold tracking-tight text-ink tabular-nums sm:text-[1.75rem]">{value}</p>
      {c && (
        <p className="flex flex-wrap items-center gap-x-1.5 text-xs text-muted">
          <span
            className={cn(
              'inline-flex items-center gap-0.5 rounded-pill px-1.5 py-0.5 font-semibold',
              c.good === true && 'bg-paid-soft text-paid',
              c.good === false && 'bg-overdue-soft text-overdue',
              c.good === null && 'bg-sunken text-muted',
            )}
          >
            <Arrow aria-hidden className="size-3.5" />
            <span className="sr-only">{c.direction === 'flat' ? 'No change' : c.direction === 'up' ? 'Up' : 'Down'}</span>
            {c.direction !== 'flat' && c.amount}
          </span>
          vs last month
        </p>
      )}
      {hint && <p className="text-xs text-subtle">{hint}</p>}
    </Card>
  )
}

/** Formats a Stat from lib/data.ts for display. */
export function formatStat(stat: Stat) {
  return stat.format === 'money' ? formatNaira(stat.value) : `${stat.value}%`
}

/** Maps a Stat from lib/data.ts onto StatCard's props. */
export function statCardProps(stat: Stat) {
  return {
    label: stat.label,
    value: formatStat(stat),
    hint: stat.hint,
    change: {
      current: stat.value,
      previous: stat.previous,
      higherIsBetter: stat.higherIsBetter,
      unit: stat.format === 'percent' ? ('points' as const) : ('percent' as const),
    },
  }
}
