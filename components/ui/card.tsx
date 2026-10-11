import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * Card: a raised panel, built from SLOTS rather than props.
 *
 *   <Card>
 *     <CardHeader title="Recent activity" actions={<Button size="sm">View all</Button>} />
 *     <CardBody>…</CardBody>
 *     <CardFooter>…</CardFooter>
 *   </Card>
 *
 * Design: instead of <Card title showFooter footerText hasAction…>, the
 * pieces are separate components you place yourself. A card without a
 * footer simply has no <CardFooter>, and a header can hold anything in
 * `actions`. New layouts never need a new boolean prop.
 */
export function Card({ className, as: Tag = 'div', ...props }: Omit<ComponentProps<'div'>, 'ref'> & { as?: 'div' | 'section' | 'article' }) {
  return <Tag {...props} className={cn('rounded-card border border-line bg-raised shadow-card', className)} />
}

type CardHeaderProps = Omit<ComponentProps<'div'>, 'title'> & {
  title?: ReactNode
  description?: ReactNode
  /** Right-aligned slot: buttons, a menu, a badge. */
  actions?: ReactNode
  /** Heading level, so cards fit the page outline (h2 on a page, h3 inside a section). */
  level?: 2 | 3
}

export function CardHeader({ title, description, actions, level = 2, className, children, ...props }: CardHeaderProps) {
  const Heading = `h${level}` as const
  return (
    <div {...props} className={cn('flex items-start justify-between gap-4 px-5 pt-5', className)}>
      <div className="min-w-0">
        {title && <Heading className="text-base font-bold text-ink">{title}</Heading>}
        {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
        {children}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  )
}

export function CardBody({ className, ...props }: ComponentProps<'div'>) {
  return <div {...props} className={cn('p-5', className)} />
}

export function CardFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div {...props} className={cn('flex items-center gap-3 border-t border-line px-5 py-3.5', className)} />
}
