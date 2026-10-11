import { RevenueChart } from '@/components/app/revenue-chart'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { getMonthlyRevenue } from '@/lib/data'
import { formatNaira, sumKobo } from '@/lib/money'
import { first } from '@/lib/url'

// @revenue SLOT: the 12-month chart. The slowest panel in development, so
// you can watch the others arrive first.
export default async function RevenueSlot({ searchParams }: PageProps<'/dashboard'>) {
  const [months, query] = await Promise.all([getMonthlyRevenue(), searchParams])
  if (first(query.fail) === 'revenue') throw new Error('Simulated failure in the @revenue slot (?fail=revenue)')

  const collected = sumKobo(months.map((m) => m.collected))
  return (
    <Card className="h-full">
      <CardHeader title="Revenue" description={`${formatNaira(collected)} collected in the last 12 months`} />
      <CardBody>
        <RevenueChart months={months} />
      </CardBody>
    </Card>
  )
}
