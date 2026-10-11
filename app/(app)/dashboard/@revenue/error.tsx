// ERROR BOUNDARY for the @revenue slot only. If the chart fails, the stat
// cards and activity feed beside it are unaffected.
'use client'

import { PanelError } from '@/components/app/panel-error'

export default function RevenueError(props: { error: Error & { digest?: string }; retry: () => void }) {
  return <PanelError title="Couldn’t load the revenue chart" className="h-full" {...props} />
}
