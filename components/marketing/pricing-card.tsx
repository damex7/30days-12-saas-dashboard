import { Check } from 'lucide-react'
import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/cn'
import { formatNaira } from '@/lib/money'
import type { Plan } from '@/lib/types'

/**
 * PricingCard: one plan with its price, highlights and a call to action.
 *
 * Design:
 * - BOTH prices are rendered on the server, and CSS shows one. The
 *   `yearly:` variant (defined in globals.css) matches when an ancestor has
 *   data-billing="yearly", which <BillingToggle> sets. So the toggle is the
 *   only Client Component; the three cards stay static HTML and switching
 *   period re-renders nothing.
 * - The button is a `cta` SLOT: the landing page passes a link to /pricing,
 *   the pricing page a link to /signup?plan=growth. The card doesn't decide.
 */
export function PricingCard({ plan, cta, className }: { plan: Plan; cta: ReactNode; className?: string }) {
  const monthlyEquivalent = Math.round(plan.yearly / 12)
  return (
    <article
      aria-labelledby={`plan-${plan.id}`}
      className={cn(
        'relative flex h-full flex-col rounded-card border bg-raised p-6 shadow-card sm:p-7',
        plan.featured ? 'border-brand shadow-raised ring-1 ring-brand' : 'border-line',
        className,
      )}
    >
      {plan.featured && (
        <Badge tone="accent" className="absolute -top-3 left-6 shadow-card">
          Most popular
        </Badge>
      )}
      <h3 id={`plan-${plan.id}`} className="text-xl font-extrabold text-ink">
        {plan.name}
      </h3>
      <p className="mt-1 text-sm text-muted">{plan.blurb}</p>

      <div className="mt-6 flex items-baseline gap-1.5">
        <span className="font-display text-4xl font-extrabold tracking-tight text-ink tabular-nums">
          <span className="yearly:hidden">{formatNaira(plan.monthly)}</span>
          <span className="hidden yearly:inline">{formatNaira(monthlyEquivalent)}</span>
        </span>
        <span className="text-sm text-muted">/ month</span>
      </div>
      <p className="mt-1 min-h-5 text-xs text-muted">
        {plan.monthly === 0 ? (
          'Free forever'
        ) : (
          <>
            <span className="yearly:hidden">Billed monthly</span>
            <span className="hidden yearly:inline">
              {formatNaira(plan.yearly)} billed yearly <span className="font-semibold text-paid">(2 months free)</span>
            </span>
          </>
        )}
      </p>

      <div className="mt-6">{cta}</div>

      <ul className="mt-7 space-y-3 border-t border-line pt-6 text-sm">
        {plan.highlights.map((h) => (
          <li key={h} className="flex gap-2.5">
            <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-brand" />
            <span className="text-ink">{h}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}
