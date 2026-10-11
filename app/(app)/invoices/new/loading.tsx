import { Card } from '@/components/ui/card'
import { LoadingRegion, Skeleton } from '@/components/ui/skeleton'

// LOADING for /invoices/new. Without it, the nearest boundary would be
// invoices/loading.tsx, and you'd see a TABLE skeleton while a FORM loads.
// loading.tsx applies to its folder and everything below, so the closest
// one wins: this one.
export default function NewInvoiceLoading() {
  return (
    <LoadingRegion label="Loading the invoice form">
      <div className="mb-8 space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-9 w-52" />
        <Skeleton className="h-5 w-80 max-w-full" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-6">
          <Card className="space-y-4 p-5">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-full" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
          </Card>
          <Card className="space-y-4 p-5">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-32" />
          </Card>
        </div>
        <Card className="h-72 p-5">
          <Skeleton className="h-full w-full" />
        </Card>
      </div>
    </LoadingRegion>
  )
}
