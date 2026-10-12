// NESTED LAYOUT: app/(app)/settings/layout.tsx
//
// Layouts nest. A visit to /settings/business renders:
//
//   RootLayout             app/layout.tsx              (html, body, toasts)
//   └ AppLayout            app/(app)/layout.tsx        (sidebar + top bar)
//     └ SettingsLayout     app/(app)/settings/layout.tsx  ← this file
//       └ BusinessPage     app/(app)/settings/business/page.tsx
//
// Switch tab to /settings/team and React compares the trees: everything
// down to SettingsLayout is the same, so it STAYS MOUNTED (no re-render,
// state kept). Only the page at the bottom is swapped. You can see it:
// - the "mounted" counter below keeps counting instead of restarting;
// - the sidebar keeps its collapsed/expanded state and scroll position;
// - while a tab loads, only the area under the tabs shows a skeleton
//   (each tab's loading.tsx), because the header and tabs are outside it.

import type { Metadata } from 'next'
import { PageHeader } from '@/components/layout/page-header'
import { MountedFor, SettingsTabs } from './settings-tabs'

// A title TEMPLATE in a nested layout: pages below set `title: 'Team'` and
// get "Team · Settings · Owó". Note that templates DON'T stack: a page's
// title fills only the NEAREST template above it, so this one has to repeat
// "· Owó" itself. (With '%s · Settings' the tab read just "Team · Settings".)
// `default` is the title for this layout's own segment.
export const metadata: Metadata = {
  title: { template: '%s · Settings · Owó', default: 'Settings' },
}

export default function SettingsLayout({ children }: LayoutProps<'/settings'>) {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Your profile, your business and how you pay for Owó."
        actions={<MountedFor />}
      >
        <SettingsTabs />
      </PageHeader>
      <div className="max-w-3xl">{children}</div>
    </>
  )
}
