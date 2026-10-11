import { Bell, Search } from 'lucide-react'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { MobileNav } from './mobile-nav'
import { NotificationsMenu, UserMenu } from './user-menus'

/**
 * TopBar: search, notifications and the user menu.
 *
 * It's a Server Component with "holes": the two menus read data (the
 * business, the notifications), so each sits in its own <Suspense>. The bar
 * itself, and the search box, are part of the static shell and appear
 * instantly; the menus stream in a moment later, each on its own.
 */
export function TopBar() {
  return (
    <header className="sticky top-0 z-30 flex h-topbar items-center gap-3 border-b border-line bg-surface/85 px-gutter backdrop-blur-md sm:px-gutter-lg print:hidden">
      <MobileNav />

      {/* SEARCH: a plain GET form. Submitting it navigates to
          /invoices?q=…, so it works before JavaScript loads and the
          results page is shareable. */}
      <form action="/invoices" role="search" className="relative max-w-md flex-1">
        <label htmlFor="global-search" className="sr-only">
          Search invoices
        </label>
        <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" />
        <input
          id="global-search"
          name="q"
          type="search"
          placeholder="Search invoices, clients…"
          className="h-10 w-full rounded-control border border-line bg-raised pr-3 pl-9 text-sm text-ink placeholder:text-subtle hover:border-line-strong focus-visible:border-brand"
        />
      </form>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <Suspense
          fallback={
            <span className="grid size-10 place-items-center text-subtle">
              <Bell aria-hidden className="size-5" />
            </span>
          }
        >
          <NotificationsMenu />
        </Suspense>
        <Suspense fallback={<Skeleton className="size-9 rounded-pill" />}>
          <UserMenu />
        </Suspense>
      </div>
    </header>
  )
}
