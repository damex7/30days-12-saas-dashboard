import { Card } from '@/components/ui/card'
import { LoadingRegion, Skeleton } from '@/components/ui/skeleton'

export default function ClientsLoading() {
  return (
    <LoadingRegion label="Loading clients">
      <div className="mb-8 space-y-2">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-5 w-72 max-w-full" />
      </div>
      <Card>
        <div className="p-4 sm:p-5">
          <Skeleton className="h-10 w-full sm:max-w-md" />
        </div>
        <div className="border-y border-line bg-sunken px-4 py-3">
          <Skeleton className="h-3 w-full max-w-xl" />
        </div>
        <ul className="divide-y divide-line">
          {Array.from({ length: 8 }, (_, i) => (
            <li key={i} className="flex items-center gap-3 px-4 py-3">
              <Skeleton className="size-9 rounded-pill" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-4 w-24" />
            </li>
          ))}
        </ul>
      </Card>
    </LoadingRegion>
  )
}
