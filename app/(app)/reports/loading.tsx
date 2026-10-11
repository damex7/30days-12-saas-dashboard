import { Card } from '@/components/ui/card'
import { LoadingRegion, Skeleton } from '@/components/ui/skeleton'

export default function ReportsLoading() {
  return (
    <LoadingRegion label="Loading reports">
      <div className="mb-8 space-y-2">
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Card key={i} className="flex flex-col gap-3 p-5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-36" />
              <Skeleton className="h-3 w-40" />
            </Card>
          ))}
        </div>
        <Card className="p-5">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="mt-6 h-64 w-full" />
        </Card>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="h-80 p-5">
            <Skeleton className="h-5 w-32" />
          </Card>
          <Card className="h-80 p-5">
            <Skeleton className="h-5 w-40" />
          </Card>
        </div>
      </div>
    </LoadingRegion>
  )
}
