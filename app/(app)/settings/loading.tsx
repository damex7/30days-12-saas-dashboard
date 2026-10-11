import { Card } from '@/components/ui/card'
import { LoadingRegion, Skeleton } from '@/components/ui/skeleton'

// LOADING for the settings tabs. It sits BELOW settings/layout.tsx, so
// while a tab loads, the "Settings" header and the tab bar stay on screen
// and only this card-shaped placeholder fills the tab's space.
export default function SettingsLoading() {
  return (
    <LoadingRegion label="Loading settings">
      <Card className="p-5">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="mt-2 h-4 w-64" />
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </Card>
    </LoadingRegion>
  )
}
