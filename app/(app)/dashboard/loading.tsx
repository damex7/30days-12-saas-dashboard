import { Card } from '@/components/ui/card'
import { LoadingRegion, Skeleton } from '@/components/ui/skeleton'

// LOADING for the `children` slot (dashboard/page.tsx). Note what it does
// NOT cover: the layout above (PageHeader) and the other slots render
// independently, so only the overdue list shows this skeleton.
export default function OverdueLoading() {
  return (
    <LoadingRegion label="Loading overdue invoices">
      <Card>
        <div className="px-5 pt-5">
          <Skeleton className="h-5 w-56" />
          <Skeleton className="mt-2 h-4 w-72 max-w-full" />
        </div>
        <ul className="mt-4 divide-y divide-line border-t border-line">
          {Array.from({ length: 4 }, (_, i) => (
            <li key={i} className="flex items-center gap-4 px-5 py-4">
              <Skeleton className="size-9 rounded-pill" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-28" />
              </div>
              <Skeleton className="h-9 w-24" />
            </li>
          ))}
        </ul>
      </Card>
    </LoadingRegion>
  )
}
