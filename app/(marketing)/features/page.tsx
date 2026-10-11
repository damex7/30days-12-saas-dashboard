import { Banknote, Landmark, MessageCircle, Smartphone } from 'lucide-react'
import type { Metadata } from 'next'
import { Section } from '@/components/layout/container'
import { CtaBand } from '@/components/marketing/cta-band'
import { FeatureGrid } from '@/components/marketing/feature-grid'
import { PageIntro } from '@/components/marketing/page-intro'
import { InvoiceStatusBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getFeatures } from '@/lib/data'
import { formatNaira, VAT_LABEL } from '@/lib/money'
import { INVOICE_STATUSES } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Features',
  description: 'Naira invoices with VAT, WhatsApp sharing, automatic reminders and a dashboard that shows who owes you what.',
}

const local = [
  { icon: Banknote, title: 'Naira first, to the kobo', body: 'Amounts are stored as whole kobo, so totals never drift by a fraction. ₦1,250,000.50 means exactly that.' },
  { icon: Landmark, title: 'Bank details on every invoice', body: 'Your account name and number print on each invoice, so clients can pay by transfer straight away.' },
  { icon: MessageCircle, title: 'WhatsApp, not just email', body: 'One tap shares the invoice link with the amount and due date already written for you.' },
  { icon: Smartphone, title: 'Light on data', body: 'Pages are mostly plain HTML, so they load quickly on a budget Android phone with patchy 3G.' },
]

export default async function FeaturesPage() {
  const features = await getFeatures()
  return (
    <>
      <PageIntro
        eyebrow="Features"
        title="Built around how Nigerian freelancers actually get paid"
        description="Bank transfers, WhatsApp and VAT at 7.5%: Owó starts from how business works here, not a template made somewhere else."
      />

      <Section>
        <FeatureGrid features={features} />
      </Section>

      <Section tone="sunken" align="start" eyebrow="Made for Nigeria" title="The details that matter here">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <ul className="grid gap-6 sm:grid-cols-2">
            {local.map((item) => (
              <li key={item.title}>
                <item.icon aria-hidden className="size-6 text-brand" />
                <h3 className="mt-3 font-bold text-ink">{item.title}</h3>
                <p className="mt-1.5 text-sm text-muted">{item.body}</p>
              </li>
            ))}
          </ul>

          {/* A small worked example, using the same money helpers as the app. */}
          <Card className="p-6">
            <p className="text-sm font-semibold text-muted">How Owó adds it up</p>
            <dl className="mt-4 space-y-2 text-sm tabular-nums">
              <div className="flex justify-between">
                <dt className="text-muted">Website design, 5 pages</dt>
                <dd className="text-ink">{formatNaira(85_000_000)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Copywriting × 4 pages</dt>
                <dd className="text-ink">{formatNaira(14_000_000)}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-2">
                <dt className="text-muted">Subtotal</dt>
                <dd className="text-ink">{formatNaira(99_000_000)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">{VAT_LABEL}</dt>
                <dd className="text-ink">{formatNaira(7_425_000)}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-2 text-base font-bold">
                <dt className="text-ink">Total</dt>
                <dd className="text-ink">{formatNaira(106_425_000)}</dd>
              </div>
            </dl>
            <p className="mt-6 text-sm font-semibold text-muted">Every invoice has a clear status</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {INVOICE_STATUSES.map((s) => (
                <InvoiceStatusBadge key={s} status={s} />
              ))}
            </div>
          </Card>
        </div>
      </Section>

      <CtaBand
        title="See it with your own invoices"
        description="Your first five invoices every month are free."
        actions={
          <Button href="/signup" size="lg" className="bg-accent text-accent-ink hover:bg-accent/90">
            Start free
          </Button>
        }
      />
    </>
  )
}
