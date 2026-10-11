import { LoadingRegion, Skeleton } from '@/components/ui/skeleton'

// LOADING for a single invoice: page header + a paper-shaped skeleton.
export default function InvoiceLoading() {
  return (
    <LoadingRegion label="Loading invoice">
      <div className="mb-8 space-y-3">
        <Skeleton className="h-4 w-36" />
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-9 w-56" />
            <Skeleton className="h-5 w-48" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-44" />
            <Skeleton className="h-10 w-44" />
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-4xl space-y-8 rounded-card border border-line bg-raised p-6 shadow-card sm:p-10">
        <div className="flex justify-between">
          <Skeleton className="h-24 w-64" />
          <Skeleton className="h-16 w-32" />
        </div>
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="ml-auto h-24 w-72" />
      </div>
    </LoadingRegion>
  )
}
