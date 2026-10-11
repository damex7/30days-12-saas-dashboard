// DASHBOARD LAYOUT with PARALLEL ROUTES: app/(app)/dashboard/layout.tsx
//
// The folders @stats, @revenue and @activity are SLOTS. Each is a separate
// route segment that renders at the SAME URL (/dashboard), and Next.js
// passes each one to this layout as a prop with the slot's name. The "@"
// folders never appear in the URL. `children` is the implicit slot: it's
// dashboard/page.tsx (the overdue-invoices list).
//
// Why bother, instead of one page that loads everything? Each slot has its
// OWN loading.tsx and error.tsx:
// - the panels stream in independently: the fast stat cards show while the
//   slower revenue chart is still loading (watch it with `npm run dev`,
//   where lib/data.ts adds a different delay to each);
// - one failing panel shows its own error and a Retry button, and the
//   others are unaffected. Try /dashboard?fail=revenue (or stats, activity).
//
// The layout only arranges the slots; it fetches nothing itself.

import { Plus } from 'lucide-react'
import type { Metadata } from 'next'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Dashboard' }

export default function DashboardLayout({ children, stats, revenue, activity }: LayoutProps<'/dashboard'>) {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="How your business is doing this month."
        actions={
          <Button href="/invoices/new">
            <Plus aria-hidden /> New invoice
          </Button>
        }
      />
      <div className="grid gap-6">
        <section aria-label="Key numbers">{stats}</section>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section aria-label="Revenue" className="min-w-0 lg:col-span-2">
            {revenue}
          </section>
          <section aria-label="Recent activity" className="min-w-0">
            {activity}
          </section>
        </div>
        <section aria-label="Overdue invoices">{children}</section>
      </div>
    </>
  )
}
