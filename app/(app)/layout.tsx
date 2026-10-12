// APP LAYOUT: app/(app)/layout.tsx, the dashboard "shell".
//
// The third ROUTE GROUP. Every signed-in page (/dashboard, /invoices,
// /clients, /reports, /settings/...) renders inside this sidebar + top bar,
// and none of their URLs contain "(app)".
//
// WHY A LAYOUT MATTERS HERE: layouts stay mounted while you navigate between
// the pages they wrap. Go from /dashboard to /invoices and only {children}
// is swapped: the sidebar doesn't re-render, its scroll position and state
// are kept, and the browser downloads only the new page's content. Nested
// layouts (dashboard/layout.tsx, invoices/layout.tsx, settings/layout.tsx)
// slot inside {children} here, the same way.
//
// The proxy (proxy.ts) has already sent anyone without the demo cookie to
// /login, so this layout never reads cookies itself, which keeps it static.

import { InlineScript } from '@/components/layout/inline-script'
import { Sidebar } from '@/components/layout/sidebar'
import { sidebarScript } from '@/components/layout/app-nav-items'
import { TopBar } from '@/components/layout/top-bar'
import type { Metadata } from 'next'

// Signed-in pages shouldn't appear in search results.
export const metadata: Metadata = { robots: { index: false, follow: false } }

export default function AppLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      {/* Applies the remembered collapsed state before the sidebar paints. */}
      <InlineScript html={sidebarScript} />
      <div className="flex min-h-dvh">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <main id="main" tabIndex={-1} className="flex-1 px-gutter py-6 focus:outline-none sm:px-gutter-lg sm:py-8 print:p-0">
            <div className="mx-auto w-full max-w-content">{children}</div>
          </main>
        </div>
      </div>
    </>
  )
}
