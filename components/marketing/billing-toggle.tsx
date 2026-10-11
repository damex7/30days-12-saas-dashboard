// CLIENT COMPONENT: the monthly/yearly choice is state that changes on click.
'use client'

import { useState, type ReactNode } from 'react'

/**
 * BillingToggle: a two-option switch that WRAPS the pricing cards.
 *
 *   <BillingToggle>
 *     <PricingCard … /> <PricingCard … />   ← Server Components, passed as children
 *   </BillingToggle>
 *
 * This is the "interleaving" pattern: a Client Component can take Server
 * Components as `children`. The toggle only sets data-billing on a wrapper
 * <div>; the cards react through the CSS `yearly:` variant. React never
 * re-renders the cards, and they ship no JavaScript.
 *
 * The control is a radio group: two mutually exclusive options, arrow keys
 * between them, announced as "Billing period, Monthly, 1 of 2".
 */
export function BillingToggle({ children }: { children: ReactNode }) {
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly')

  return (
    <div data-billing={period}>
      <fieldset className="mx-auto mb-10 flex w-fit items-center gap-1 rounded-pill border border-line bg-raised p-1 shadow-card">
        <legend className="sr-only">Billing period</legend>
        {(['monthly', 'yearly'] as const).map((value) => (
          <label
            key={value}
            className="relative cursor-pointer rounded-pill px-4 py-2 text-sm font-semibold text-muted transition-colors has-checked:bg-brand has-checked:text-brand-ink has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus"
          >
            <input
              type="radio"
              name="billing-period"
              value={value}
              checked={period === value}
              onChange={() => setPeriod(value)}
              className="sr-only"
            />
            {value === 'monthly' ? 'Monthly' : 'Yearly'}
            {value === 'yearly' && <span className="ml-1.5 rounded-pill bg-accent px-1.5 py-0.5 text-[0.6875rem] text-accent-ink">2 months free</span>}
          </label>
        ))}
      </fieldset>
      {children}
    </div>
  )
}
