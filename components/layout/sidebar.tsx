// CLIENT COMPONENT: the collapse button changes state and writes to
// localStorage. Everything it renders around that is ordinary markup.
'use client'

import { PanelLeftClose, PanelLeftOpen, Plus } from 'lucide-react'
import { Suspense, useLayoutEffect, useSyncExternalStore } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import { appNavItems, SIDEBAR_STORAGE_KEY } from './app-nav-items'
import { Logo } from './logo'
import { NavItem } from './nav-item'
import { ThemeToggle } from './theme-toggle'

const CHANGE_EVENT = 'owo-sidebar-change'

function readCollapsed() {
  try {
    return localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'collapsed'
  } catch {
    return false
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange)
  window.addEventListener('storage', onChange)
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange)
    window.removeEventListener('storage', onChange)
  }
}

function applyToDocument(collapsed: boolean) {
  if (collapsed) document.documentElement.dataset.sidebar = 'collapsed'
  else delete document.documentElement.dataset.sidebar
}

function setCollapsed(collapsed: boolean) {
  try {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, collapsed ? 'collapsed' : 'expanded')
  } catch {
    // Storage blocked: the choice still applies until the page is reloaded.
  }
  applyToDocument(collapsed)
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

/** The nav list itself, shared with the phone drawer. */
export function AppNavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <ul className="flex flex-col gap-1">
      {appNavItems.map((item) => (
        <li key={item.href}>
          <NavItem {...item} onNavigate={onNavigate} />
        </li>
      ))}
    </ul>
  )
}

/** Shown while usePathname() can't run yet (prerendering): same links, no active state. */
function AppNavFallback() {
  return (
    <ul className="flex flex-col gap-1">
      {appNavItems.map(({ href, label, icon: Icon }) => (
        <li key={href}>
          <a href={href} className="flex items-center gap-3 rounded-control px-3 py-2.5 text-sm font-semibold text-muted md:sidebar-collapsed:justify-center md:sidebar-collapsed:px-0">
            <Icon aria-hidden className="size-5 shrink-0" />
            <span className="md:sidebar-collapsed:sr-only">{label}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

/**
 * Sidebar: the app's main navigation, collapsible to icons only.
 *
 * Where the collapsed state lives: a data-sidebar="collapsed" attribute on
 * <html>, mirrored in localStorage so it's remembered. CSS does the rest
 * through the `sidebar-collapsed:` variant (width, hidden labels,
 * tooltips), so React doesn't re-render the nav to collapse it.
 *
 * Why not a cookie (which the server could read)? Reading a cookie makes
 * the whole app shell request-time, and with Cache Components it would have
 * to wait behind a Suspense boundary. localStorage plus the pre-paint script
 * keeps the shell static AND avoids the flash.
 */
export function Sidebar() {
  // The server can't see localStorage, so it assumes "expanded"; the browser
  // corrects it immediately (and the pre-paint script already fixed the CSS).
  const collapsed = useSyncExternalStore(subscribe, readCollapsed, () => false)

  // The <head>-style script only runs on a full page load. After a client-side
  // navigation into the app (e.g. from /login), sync the attribute here,
  // before the browser paints.
  useLayoutEffect(() => {
    applyToDocument(readCollapsed())
  }, [])

  return (
    <aside
      aria-label="Sidebar"
      className={cn(
        'sticky top-0 hidden h-dvh w-sidebar shrink-0 flex-col border-r border-line bg-raised transition-[width] duration-200 md:flex',
        'md:sidebar-collapsed:w-sidebar-collapsed print:hidden',
      )}
    >
      <div className="flex h-topbar items-center px-5 md:sidebar-collapsed:justify-center md:sidebar-collapsed:px-0">
        <Logo href="/dashboard" compactOnCollapse />
      </div>

      <div className="px-3 pt-2 pb-4 md:sidebar-collapsed:px-3.5">
        <Button href="/invoices/new" block className="md:sidebar-collapsed:px-0">
          <Plus aria-hidden />
          <span className="md:sidebar-collapsed:sr-only">New invoice</span>
        </Button>
      </div>

      {/* Collapsed, the nav must not clip: the tooltips stick out to the right. */}
      <nav aria-label="Main" className="flex-1 overflow-y-auto px-3 md:sidebar-collapsed:overflow-visible md:sidebar-collapsed:px-3.5">
        <Suspense fallback={<AppNavFallback />}>
          <AppNavList />
        </Suspense>
      </nav>

      <div className="flex flex-col gap-3 border-t border-line p-3 md:sidebar-collapsed:items-center">
        <ThemeToggle className="self-start md:sidebar-collapsed:hidden" />
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-pressed={collapsed}
          className="flex items-center gap-3 rounded-control px-3 py-2 text-sm font-semibold text-muted hover:bg-sunken hover:text-ink md:sidebar-collapsed:px-2.5"
        >
          {collapsed ? <PanelLeftOpen aria-hidden className="size-5" /> : <PanelLeftClose aria-hidden className="size-5" />}
          <span className="md:sidebar-collapsed:sr-only">Collapse sidebar</span>
        </button>
      </div>
    </aside>
  )
}
