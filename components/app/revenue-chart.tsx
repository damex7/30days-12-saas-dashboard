import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table'
import { cn } from '@/lib/cn'
import { formatLongMonth, formatMonth } from '@/lib/dates'
import { formatNaira, formatNairaCompact } from '@/lib/money'
import type { MonthRevenue } from '@/lib/types'

/** Rounds the chart's top value up to a "nice" number (1, 2, 2.5 or 5 × 10ⁿ). */
function niceMax(value: number) {
  if (value <= 0) return 100
  const power = 10 ** Math.floor(Math.log10(value))
  const step = [1, 2, 2.5, 5, 10].find((s) => s * power >= value)!
  return step * power
}

/**
 * RevenueChart: invoiced vs collected for the last 12 months.
 *
 * Why plain SVG instead of a chart library (Recharts):
 * - It's a SERVER COMPONENT: zero JavaScript is sent for it, it renders in
 *   the first HTML and it prints.
 * - Twelve pairs of bars is a few lines of maths; a library would add ~100 KB
 *   and force a Client Component for something that never changes on screen.
 *
 * How it's built: the BARS are an SVG stretched to fill the box
 * (preserveAspectRatio="none"), while the TEXT (axis labels, hover values)
 * is HTML positioned on top, so it stays crisp and readable at 360px
 * instead of shrinking with the SVG.
 *
 * Accessibility: the figure is described in its caption, and the same
 * numbers are available as a real table (a <details> anyone can open, not
 * a screen-reader-only secret).
 */
export function RevenueChart({ months, className, compact }: { months: MonthRevenue[]; className?: string; compact?: boolean }) {
  const max = niceMax(Math.max(...months.flatMap((m) => [m.invoiced, m.collected])))
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * max)
  const slot = 10 // each month gets 10 SVG units of width
  const pct = (v: number) => (v / max) * 100

  return (
    <figure className={cn('flex flex-col gap-3', className)}>
      <div className={cn('relative pl-12', compact ? 'h-40' : 'h-56 sm:h-64')}>
        {/* Gridlines and y-axis labels (HTML, so the text stays crisp). */}
        {ticks.map((t) => (
          <div key={t} aria-hidden className="absolute right-0 left-12 border-t border-dashed border-line" style={{ bottom: `${pct(t)}%` }}>
            <span className="absolute -top-2 -left-12 w-10 text-right text-[0.6875rem] text-subtle tabular-nums">
              {formatNairaCompact(t)}
            </span>
          </div>
        ))}

        {/* The bars: one SVG, stretched to the box. */}
        <svg
          aria-hidden
          viewBox={`0 0 ${months.length * slot} 100`}
          preserveAspectRatio="none"
          className="absolute inset-y-0 right-0 left-12 h-full w-[calc(100%-3rem)]"
        >
          {months.map((m, i) => (
            <g key={m.month}>
              <rect x={i * slot + 1.5} width={3.4} y={100 - pct(m.invoiced)} height={pct(m.invoiced)} rx={0.8} className="fill-accent" />
              <rect x={i * slot + 5.1} width={3.4} y={100 - pct(m.collected)} height={pct(m.collected)} rx={0.8} className="fill-brand" />
            </g>
          ))}
        </svg>

        {/* Hover targets with the exact values, one column per month. */}
        <div aria-hidden className="absolute inset-y-0 right-0 left-12 grid" style={{ gridTemplateColumns: `repeat(${months.length}, 1fr)` }}>
          {months.map((m) => (
            <div key={m.month} className="group relative">
              <div className="absolute inset-x-0.5 inset-y-0 rounded-control group-hover:bg-ink/5" />
              <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden w-max -translate-x-1/2 rounded-control bg-ink px-2.5 py-1.5 text-xs text-surface shadow-raised group-hover:block">
                <p className="font-semibold">{formatLongMonth(m.month)}</p>
                <p>Invoiced {formatNaira(m.invoiced)}</p>
                <p>Collected {formatNaira(m.collected)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Month labels. On narrow screens every other one is hidden. */}
      <div aria-hidden className="grid pl-12 text-center text-[0.6875rem] text-subtle" style={{ gridTemplateColumns: `repeat(${months.length}, 1fr)` }}>
        {months.map((m, i) => (
          <span key={m.month} className={cn(i % 2 === 1 && (compact ? 'invisible' : 'max-sm:invisible'))}>
            {formatMonth(m.month)}
          </span>
        ))}
      </div>

      <figcaption className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
        <span className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span aria-hidden className="size-2.5 rounded-sm bg-accent" /> Invoiced
          </span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden className="size-2.5 rounded-sm bg-brand" /> Collected
          </span>
        </span>
        {!compact && <span className="sr-only">Bar chart of invoiced and collected revenue for the last 12 months.</span>}
      </figcaption>

      {!compact && (
        <details className="group text-sm">
          <summary className="cursor-pointer text-xs font-semibold text-brand hover:underline">Show as a table</summary>
          <Table caption="Revenue by month" captionHidden className="mt-3">
            <THead>
              <TR>
                <TH>Month</TH>
                <TH align="right">Invoiced</TH>
                <TH align="right">Collected</TH>
              </TR>
            </THead>
            <TBody>
              {months.map((m) => (
                <TR key={m.month}>
                  <TD>{formatLongMonth(m.month)}</TD>
                  <TD align="right">{formatNaira(m.invoiced)}</TD>
                  <TD align="right">{formatNaira(m.collected)}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </details>
      )}
    </figure>
  )
}
