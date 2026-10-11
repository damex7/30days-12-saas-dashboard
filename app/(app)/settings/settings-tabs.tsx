// CLIENT COMPONENTS used by the settings layout.
'use client'

import { Timer } from 'lucide-react'
import { useSelectedLayoutSegment } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LinkTabs } from '@/components/ui/link-tabs'

const tabs = [
  { key: 'profile', href: '/settings/profile', label: 'Profile' },
  { key: 'business', href: '/settings/business', label: 'Business' },
  { key: 'billing', href: '/settings/billing', label: 'Billing' },
  { key: 'team', href: '/settings/team', label: 'Team' },
]

/**
 * A layout doesn't receive the current pathname (it would have to
 * re-render on every navigation, which is exactly what layouts avoid). So
 * this small Client Component asks: useSelectedLayoutSegment() returns the
 * segment one level below the layout it's rendered in: "profile",
 * "business"... It then hands that to the server-friendly <LinkTabs>.
 */
export function SettingsTabs() {
  const segment = useSelectedLayoutSegment()
  return <LinkTabs label="Settings sections" items={tabs} current={segment} />
}

/**
 * A learning aid: counts the seconds since the settings layout MOUNTED.
 * Switch tabs and it keeps counting, proof that the layout (and this
 * component's state) survived the navigation. Compare the auth pages,
 * whose template.tsx remounts and replays its animation every time.
 */
export function MountedFor() {
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    const timer = window.setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => window.clearInterval(timer)
  }, [])
  return (
    <span className="inline-flex items-center gap-1.5 rounded-pill border border-dashed border-line-strong px-3 py-1 text-xs text-muted" title="Switch tabs: this counter keeps going because the layout stays mounted.">
      <Timer aria-hidden className="size-3.5" />
      Layout mounted {seconds}s ago
    </span>
  )
}
