// ERROR BOUNDARY for the @activity slot only.
'use client'

import { PanelError } from '@/components/app/panel-error'

export default function ActivityError(props: { error: Error & { digest?: string }; retry: () => void }) {
  return <PanelError title="Couldn’t load recent activity" className="h-full" {...props} />
}
