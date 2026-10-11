import { Card } from '@/components/ui/card'
import { LoadingRegion, Skeleton } from '@/components/ui/skeleton'

// LOADING for the @activity slot: the feed's rows as placeholders.
export default function ActivityLoading() {
  return (
    <LoadingRegion label="Loading recent activity" className="h-full">
      <Card className="h-full p-5">
        <Skeleton className="h-5 w-36" />
        <ul className="mt-6 space-y-4">
          {Array.from({ length: 7 }, (_, i) => (
            <li key={i} className="flex gap-3">
              <Skeleton className="size-8 rounded-pill" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </LoadingRegion>
  )
}
