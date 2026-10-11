import { Download } from 'lucide-react'
import type { Metadata } from 'next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardBody, CardFooter, CardHeader } from '@/components/ui/card'
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table'
import { getBusiness, getPlans } from '@/lib/data'
import { formatDate, monthsBefore, todayInLagos } from '@/lib/dates'
import { formatNaira } from '@/lib/money'

export const metadata: Metadata = { title: 'Billing' }

export default async function BillingSettings() {
  const [business, plans] = await Promise.all([getBusiness(), getPlans()])
  const plan = plans.find((p) => p.id === business.plan) ?? plans[0]
  const today = todayInLagos()
  // Sample payment history: the 1st of each of the last four months.
  const payments = [0, 1, 2, 3].map((n) => ({ date: `${monthsBefore(today, n)}-01`, amount: plan.monthly }))
  const renews = `${monthsBefore(today, -1)}-01`

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader title="Current plan" actions={<Badge tone="brand">{plan.name}</Badge>} />
        <CardBody>
          <p className="font-display text-3xl font-extrabold text-ink">
            {formatNaira(plan.monthly)}
            <span className="ml-1 font-sans text-base font-normal text-muted">/ month</span>
          </p>
          <p className="mt-1 text-sm text-muted">Renews on {formatDate(renews)}. Switch to yearly billing to get two months free.</p>
          <ul className="mt-4 grid gap-1.5 text-sm text-ink sm:grid-cols-2">
            {plan.highlights.map((h) => (
              <li key={h}>✓ {h}</li>
            ))}
          </ul>
        </CardBody>
        <CardFooter className="flex-wrap">
          <Button href="/pricing" variant="secondary">
            Compare plans
          </Button>
          <Button variant="ghost" className="text-danger hover:bg-overdue-soft">
            Cancel plan
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader title="Payment history" description="Sample data." className="pb-4" />
        <Table caption="Payment history" captionHidden>
          <THead>
            <TR>
              <TH>Date</TH>
              <TH>Description</TH>
              <TH align="right">Amount</TH>
              <TH className="w-12">
                <span className="sr-only">Receipt</span>
              </TH>
            </TR>
          </THead>
          <TBody>
            {payments.map((p) => (
              <TR key={p.date}>
                <TD className="whitespace-nowrap">{formatDate(p.date)}</TD>
                <TD className="text-muted">Owó {plan.name}, monthly</TD>
                <TD align="right">{formatNaira(p.amount)}</TD>
                <TD>
                  <Button variant="ghost" size="icon" aria-label={`Download receipt for ${formatDate(p.date)}`}>
                    <Download aria-hidden />
                  </Button>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </Card>
    </div>
  )
}
