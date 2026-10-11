// MARKETING LAYOUT: app/(marketing)/layout.tsx
//
// ROUTE GROUP: the "(marketing)" folder name is in brackets, so it is NOT
// part of the URL. app/(marketing)/pricing/page.tsx is served at /pricing,
// not /marketing/pricing. A route group exists only to give a set of pages
// their own layout: here, the sticky header and the big footer. The auth
// pages and the app are in other groups and never see this chrome.
//
// One catch: two groups can't both have a page at the same URL. The
// marketing site has /customers (case studies), so the app's customer list
// lives at /clients instead. Otherwise the build fails with a conflict.

import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'

export default function MarketingLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      {/* id="main" is the skip link's target (the link lives in the root layout). */}
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}
