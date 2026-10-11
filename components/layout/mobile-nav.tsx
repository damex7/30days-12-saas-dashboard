// CLIENT COMPONENT: the drawer is open/closed state.
'use client'

import { Menu, Plus } from 'lucide-react'
import { Suspense, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { LogoMark } from './logo'
import { AppNavList } from './sidebar'
import { ThemeToggle } from './theme-toggle'

/**
 * MobileNav: under 768px the sidebar is hidden and this button opens the
 * same navigation in a slide-in drawer. The drawer is our <Dialog> with
 * side="left", so it gets the same focus handling and Esc-to-close for free,
 * and focus returns to this button when it closes.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-expanded={open} className="-ml-2 md:hidden">
        <Menu aria-hidden />
        <span className="sr-only">Open navigation</span>
      </Button>
      <Dialog
        open={open}
        onClose={close}
        side="left"
        title={
          <span className="flex items-center gap-2">
            <LogoMark className="size-7" /> Owó
          </span>
        }
      >
        <div className="flex h-full flex-col gap-6">
          <Button href="/invoices/new" onClick={close} block>
            <Plus aria-hidden /> New invoice
          </Button>
          <nav aria-label="Main">
            <Suspense>
              <AppNavList onNavigate={close} />
            </Suspense>
          </nav>
          <div className="mt-auto border-t border-line pt-4">
            <ThemeToggle />
          </div>
        </div>
      </Dialog>
    </>
  )
}
