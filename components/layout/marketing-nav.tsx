// CLIENT COMPONENTS: the active link needs usePathname(), and the mobile
// menu is open/closed state. The header around them stays a Server Component.
'use client'

import { Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { cn } from '@/lib/cn'
import { marketingLinks } from './marketing-links'

/** Desktop nav links with aria-current on the page you're on. */
export function MarketingNavLinks() {
  const pathname = usePathname()
  return (
    <ul className="flex items-center gap-1">
      {marketingLinks.map((link) => {
        const active = pathname === link.href
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'rounded-control px-3 py-2 text-sm font-semibold transition-colors',
                active ? 'text-brand' : 'text-muted hover:text-ink',
              )}
            >
              {link.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

/** The same links in a slide-in drawer for phones. */
export function MarketingMobileMenu() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-expanded={open} className="md:hidden">
        <Menu aria-hidden />
        <span className="sr-only">Open menu</span>
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Menu" side="left">
        <nav aria-label="Main">
          <ul className="flex flex-col gap-1">
            {marketingLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === link.href ? 'page' : undefined}
                  className="block rounded-control px-3 py-2.5 font-semibold text-ink hover:bg-sunken aria-[current=page]:bg-brand-soft aria-[current=page]:text-brand-strong"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-6 flex flex-col gap-2 border-t border-line pt-6">
          <Button href="/login" variant="secondary" onClick={() => setOpen(false)}>
            Sign in
          </Button>
          <Button href="/signup" onClick={() => setOpen(false)}>
            Start free
          </Button>
        </div>
      </Dialog>
    </>
  )
}
