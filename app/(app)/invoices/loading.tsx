import { Card } from '@/components/ui/card'
import { LoadingRegion, Skeleton } from '@/components/ui/skeleton'

// LOADING for /invoices: shown inside the app shell (the sidebar and top bar
// are in a layout above, so they stay put) while the list loads. It matches
// the real page: header, filter bar, ten table rows, footer.
export default function InvoicesLoading() {
  return (
    <LoadingRegion label="Loading invoices">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-5 w-80 max-w-full" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>
      <Card>
        <div className="space-y-4 p-4 sm:p-5">
          <Skeleton className="h-10 w-full sm:max-w-md" />
          <Skeleton className="h-9 w-full max-w-lg" />
        </div>
        <div className="border-y border-line bg-sunken px-4 py-3">
          <Skeleton className="h-3 w-full max-w-2xl" />
        </div>
        <ul className="divide-y divide-line">
          {Array.from({ length: 10 }, (_, i) => (
            <li key={i} className="flex items-center gap-4 px-4 py-3.5">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="size-7 rounded-pill max-sm:hidden" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-24 max-md:hidden" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-16 rounded-pill" />
            </li>
          ))}
        </ul>
      </Card>
    </LoadingRegion>
  )
}
