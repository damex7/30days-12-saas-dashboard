// CLIENT COMPONENT: usePathname() reads the current URL in the browser,
// which is how the item knows to show itself as active.
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'
import { Tooltip } from '@/components/ui/tooltip'
import { cn } from '@/lib/cn'

/**
 * NavItem: one link in the app sidebar.
 *
 * Design:
 * - ACTIVE STATE from usePathname(): /invoices/INV-0042 still highlights
 *   "Invoices", because it matches the href or anything below it.
 *   aria-current="page" tells screen readers the same thing.
 * - COLLAPSED SIDEBAR: the label becomes sr-only (still the link's
 *   accessible name) and a Tooltip shows it on hover/focus instead. Both
 *   are driven by the `sidebar-collapsed:` CSS variant, so this component
 *   doesn't need to know whether the sidebar is collapsed.
 * - We deliberately DON'T spread the tooltip's aria-describedby here: the
 *   tooltip text equals the link's name, and it would be read twice.
 */
export function NavItem({ href, label, icon: Icon, onNavigate }: { href: string; label: string; icon: LucideIcon; onNavigate?: () => void }) {
  const pathname = usePathname()
  const active = pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Tooltip content={label} side="right" className="hidden md:sidebar-collapsed:block" wrapperClassName="flex w-full">
      {() => (
        <Link
          href={href}
          onClick={onNavigate}
          aria-current={active ? 'page' : undefined}
          className={cn(
            'group flex w-full items-center gap-3 rounded-control px-3 py-2.5 text-sm font-semibold transition-colors',
            'md:sidebar-collapsed:justify-center md:sidebar-collapsed:px-0',
            active ? 'bg-brand text-brand-ink shadow-card' : 'text-muted hover:bg-sunken hover:text-ink',
          )}
        >
          <Icon aria-hidden className="size-5 shrink-0" />
          <span className="md:sidebar-collapsed:sr-only">{label}</span>
        </Link>
      )}
    </Tooltip>
  )
}
