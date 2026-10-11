import { Card } from '@/components/ui/card'
import { LoadingRegion, Skeleton } from '@/components/ui/skeleton'

// LOADING for the @stats slot only: Next.js wraps the slot's page in a
// <Suspense> with this as the fallback. Same grid and card heights as the
// real stat cards, so nothing jumps when they arrive.
export default function StatsLoading() {
  return (
    <LoadingRegion label="Loading key numbers" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }, (_, i) => (
        <Card key={i} className="flex flex-col gap-3 p-5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="size-8" />
          </div>
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-40" />
        </Card>
      ))}
    </LoadingRegion>
  )
}
