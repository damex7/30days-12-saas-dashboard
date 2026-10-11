import { ActivityFeed } from '@/components/app/activity-feed'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { getActivity } from '@/lib/data'
import { first } from '@/lib/url'

// @activity SLOT: the latest events across all invoices.
export default async function ActivitySlot({ searchParams }: PageProps<'/dashboard'>) {
  const [{ items, today }, query] = await Promise.all([getActivity(7), searchParams])
  if (first(query.fail) === 'activity') throw new Error('Simulated failure in the @activity slot (?fail=activity)')

  return (
    <Card className="h-full">
      <CardHeader title="Recent activity" />
      <CardBody>
        <ActivityFeed items={items} today={today} />
      </CardBody>
    </Card>
  )
}
