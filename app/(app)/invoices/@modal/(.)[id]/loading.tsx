import { InvoiceModal } from '@/components/app/invoice-modal'
import { LoadingRegion, Skeleton } from '@/components/ui/skeleton'

// LOADING for the intercepted modal: the modal opens straight away with a
// skeleton of its contents, instead of nothing happening until data arrives.
export default function QuickViewLoading() {
  return (
    <InvoiceModal title="Loading invoice…">
      <LoadingRegion label="Loading invoice" className="space-y-5">
        <div className="flex justify-between">
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
          <Skeleton className="h-6 w-16 rounded-pill" />
        </div>
        <Skeleton className="h-36 w-full" />
        <div className="space-y-2">
          <Skeleton className="ml-auto h-4 w-48" />
          <Skeleton className="ml-auto h-4 w-48" />
          <Skeleton className="ml-auto h-5 w-56" />
        </div>
      </LoadingRegion>
    </InvoiceModal>
  )
}
