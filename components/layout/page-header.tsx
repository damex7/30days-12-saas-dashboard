import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * PageHeader: the title row at the top of an app page.
 *
 *   <PageHeader
 *     title="Invoices"
 *     description="Everything you've billed, newest first."
 *     actions={<Button href="/invoices/new"><Plus /> New invoice</Button>}
 *   />
 *
 * Design: `actions` and `breadcrumb` are SLOTS. One page puts a single
 * button there, another a button and a menu, the invoice page a status
 * badge and three actions, and PageHeader never needs to know. The
 * alternative (showNewButton, newButtonHref, secondaryAction...) grows a
 * prop for every page. `children` sits under the title for extras like tabs.
 */
export function PageHeader({
  title,
  description,
  actions,
  breadcrumb,
  level = 1,
  className,
  children,
}: {
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  breadcrumb?: ReactNode
  /** It's the page's <h1> by default; the /ui showcase renders one as an example, at h2. */
  level?: 1 | 2
  className?: string
  children?: ReactNode
}) {
  const Heading = `h${level}` as const
  return (
    <header className={cn('mb-6 sm:mb-8', className)}>
      {breadcrumb && <div className="mb-3 text-sm text-muted print:hidden">{breadcrumb}</div>}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <div className="min-w-0">
          <Heading className="text-2xl font-extrabold text-ink sm:text-3xl">{title}</Heading>
          {description && <p className="mt-1.5 max-w-2xl text-muted">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2 print:hidden">{actions}</div>}
      </div>
      {children && <div className="mt-6">{children}</div>}
    </header>
  )
}
