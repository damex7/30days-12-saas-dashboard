import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * EmptyState: what to show when a list has nothing in it.
 * A good empty state says what would be here and offers the next step, so
 * the `action` slot takes any button or link ("Create an invoice",
 * "Clear filters") rather than a fixed label and href.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col items-center px-6 py-12 text-center', className)}>
      {icon && (
        <div aria-hidden className="mb-4 grid size-12 place-items-center rounded-card bg-brand-soft text-brand [&_svg]:size-6">
          {icon}
        </div>
      )}
      <p className="font-display text-lg font-bold text-ink">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-5 flex flex-wrap justify-center gap-2">{action}</div>}
    </div>
  )
}
