// CLIENT COMPONENT: closing the modal means going BACK in history
// (router.back()), and that needs the router in the browser.
'use client'

import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { Dialog } from '@/components/ui/dialog'

/**
 * The quick-view modal shell for an intercepted /invoices/[id].
 *
 * Only the SHELL is a Client Component. The invoice content arrives as
 * `children` already rendered on the server (a Server Component), so the
 * modal ships no data-fetching code and no money-formatting code to the
 * browser. That's the "client wrapper, server content" pattern.
 *
 * Closing (Esc, ×, backdrop) calls router.back(): the URL returns to
 * /invoices, the @modal slot goes back to rendering nothing, and the list
 * behind it never re-rendered at all.
 */
export function InvoiceModal({ title, footer, children }: { title: ReactNode; footer?: ReactNode; children: ReactNode }) {
  const router = useRouter()
  return (
    <Dialog open onClose={() => router.back()} title={title} footer={footer} size="md">
      {children}
    </Dialog>
  )
}
