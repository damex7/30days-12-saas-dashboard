import type { Metadata } from 'next'
import { Section } from '@/components/layout/container'
import { BillingToggle } from '@/components/marketing/billing-toggle'
import { ComparisonTable } from '@/components/marketing/comparison-table'
import { CtaBand } from '@/components/marketing/cta-band'
import { Faq } from '@/components/marketing/faq'
import { PageIntro } from '@/components/marketing/page-intro'
import { PricingCard } from '@/components/marketing/pricing-card'
import { Button } from '@/components/ui/button'
import { getComparison, getFaqs, getPlans } from '@/lib/data'

// METADATA: this title fills the root layout's template → "Pricing · Owó".
export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Owó plans in naira: Free, Growth and Business. Pay monthly, or yearly and get two months free.',
}

export default async function PricingPage() {
  const [plans, comparison, faqs] = await Promise.all([getPlans(), getComparison(), getFaqs()])

  return (
    <>
      <PageIntro
        eyebrow="Pricing"
        title="Pay for Owó in naira, like your clients pay you"
        description="Start free and upgrade when you need reminders, reports or a team. Pay yearly and get two months free."
      />

      <Section className="pt-12 sm:pt-16">
        {/* Client Component wrapping Server Components: the toggle owns the
            state, the cards are static HTML passed in as children. */}
        <BillingToggle>
          <ul className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <li key={plan.id}>
                <PricingCard
                  plan={plan}
                  cta={
                    <Button href={`/signup?plan=${plan.id}`} variant={plan.featured ? 'primary' : 'secondary'} block>
                      {plan.cta}
                    </Button>
                  }
                />
              </li>
            ))}
          </ul>
        </BillingToggle>
        <p className="mt-6 text-center text-sm text-muted">Prices exclude VAT. Paid plans come with a 14-day free trial.</p>
      </Section>

      <Section id="compare" tone="sunken" title="Compare plans" description="Every plan includes naira invoices, VAT and WhatsApp sharing.">
        <ComparisonTable plans={plans} rows={comparison} />
      </Section>

      {/* The same Faq component and data as the landing page. */}
      <Section id="faq" eyebrow="FAQ" title="Pricing questions">
        <Faq items={faqs} />
      </Section>

      <CtaBand
        title="Try Growth free for 14 days"
        description="No card needed. If it doesn’t pay for itself, stay on Free."
        actions={
          <Button href="/signup?plan=growth" size="lg" className="bg-accent text-accent-ink hover:bg-accent/90">
            Start your trial
          </Button>
        }
      />
    </>
  )
}
