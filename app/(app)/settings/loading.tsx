import { Card } from '@/components/ui/card'
import { LoadingRegion, Skeleton } from '@/components/ui/skeleton'

// LOADING for the settings tabs. It sits BELOW settings/layout.tsx, so
// while a tab loads, the "Settings" header and the tab bar stay on screen
// and only this card-shaped placeholder fills the tab's space.
//
// WHY EVERY TAB ALSO HAS A loading.tsx RE-EXPORTING THIS ONE: on a client
// navigation, only the part BELOW the layout both routes share re-renders.
// Coming from /dashboard, that's the settings layout, and this file's
// boundary covers it. Switching tabs (/settings/business → /settings/billing)
// shares the settings layout itself, so its boundary doesn't apply: the
// tab's await on live data would block the click until the server answered.
// A loading.tsx inside each tab's folder sits below the shared layout, so
// the skeleton shows on every tab switch.
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
