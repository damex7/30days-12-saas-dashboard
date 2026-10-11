// ERROR BOUNDARY for the @stats slot only. If this panel throws, Next.js
// renders this in its place and every other panel carries on. Error
// boundaries must be Client Components.
'use client'

import { PanelError } from '@/components/app/panel-error'

export default function StatsError(props: { error: Error & { digest?: string }; retry: () => void }) {
  return <PanelError title="Couldn’t load your key numbers" {...props} />
}
