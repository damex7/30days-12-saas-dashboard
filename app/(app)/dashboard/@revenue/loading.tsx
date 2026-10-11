import { Card } from '@/components/ui/card'
import { LoadingRegion, Skeleton } from '@/components/ui/skeleton'

// LOADING for the @revenue slot: a chart-shaped skeleton.
const heights = ['h-[45%]', 'h-[60%]', 'h-[40%]', 'h-[75%]', 'h-[55%]', 'h-[65%]', 'h-[35%]', 'h-[80%]', 'h-[50%]', 'h-[70%]', 'h-[60%]', 'h-[85%]']

export default function RevenueLoading() {
  return (
    <LoadingRegion label="Loading revenue chart" className="h-full">
      <Card className="h-full p-5">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="mt-2 h-4 w-60" />
        <div className="mt-8 flex h-56 items-end gap-2 pl-12 sm:h-64">
          {heights.map((h, i) => (
            <Skeleton key={i} className={`flex-1 rounded-b-none ${h}`} />
          ))}
        </div>
        <Skeleton className="mt-4 h-3 w-40" />
      </Card>
    </LoadingRegion>
  )
}
