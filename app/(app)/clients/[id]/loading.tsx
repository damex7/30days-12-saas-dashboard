import { Card } from '@/components/ui/card'
import { LoadingRegion, Skeleton } from '@/components/ui/skeleton'

export default function ClientLoading() {
  return (
    <LoadingRegion label="Loading client">
      <div className="mb-8 space-y-3">
        <Skeleton className="h-4 w-40" />
        <div className="flex items-center gap-3">
          <Skeleton className="size-14 rounded-pill" />
          <Skeleton className="h-9 w-64" />
        </div>
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }, (_, i) => (
              <Card key={i} className="h-32 p-5">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="mt-4 h-8 w-32" />
              </Card>
            ))}
          </div>
          <Card className="h-80 p-5">
            <Skeleton className="h-5 w-24" />
          </Card>
        </div>
        <Card className="h-56 p-5">
          <Skeleton className="h-5 w-20" />
        </Card>
      </div>
    </LoadingRegion>
  )
}
