import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Logo } from './logo'
import { marketingLinks } from './marketing-links'
import { MarketingMobileMenu, MarketingNavLinks } from './marketing-nav'

/**
 * The marketing header: sticky, translucent, with the nav and the
 * "Start free" button. A Server Component; only the two pieces that need
 * the browser (active link, mobile drawer) are Client Components.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/85 backdrop-blur-md supports-[not(backdrop-filter:blur(1px))]:bg-surface">
      <div className="mx-auto flex h-header max-w-content items-center gap-6 px-gutter sm:px-gutter-lg">
        <Logo />
        <nav aria-label="Main" className="hidden md:block">
          {/* usePathname() inside MarketingNavLinks reads the URL, which a
              prerendered page doesn't know at build time. The Suspense
              boundary lets Next.js prerender plain links as the fallback
              and fill in the active state in the browser. */}
          <Suspense fallback={<StaticLinks />}>
            <MarketingNavLinks />
          </Suspense>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Button href="/login" variant="ghost" className="hidden sm:inline-flex">
            Sign in
          </Button>
          <Button href="/signup">Start free</Button>
          <Suspense>
            <MarketingMobileMenu />
          </Suspense>
        </div>
      </div>
    </header>
  )
}

function StaticLinks() {
  return (
    <ul className="flex items-center gap-1">
      {marketingLinks.map((link) => (
        <li key={link.href}>
          <a href={link.href} className="rounded-control px-3 py-2 text-sm font-semibold text-muted">
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  )
}
