import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * Container: centres content and sets the side gutters, in ONE place. Every
 * page uses it, so the marketing site, auth and app line up to the same
 * edges and a gutter change is a one-line edit.
 */
export function Container({
  size = 'content',
  className,
  children,
}: {
  size?: 'content' | 'reading' | 'full'
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-gutter sm:px-gutter-lg',
        size === 'content' && 'max-w-content',
        size === 'reading' && 'max-w-reading',
        className,
      )}
    >
      {children}
    </div>
  )
}

/**
 * Section: a full-width band of a page with an optional heading block.
 * The heading parts are slots (eyebrow, title, description, actions), each
 * any ReactNode, so a section can have a badge as its eyebrow or two buttons
 * as actions without new props. `id` makes it linkable (/#pricing), and the
 * title labels the <section> landmark for screen readers.
 */
export function Section({
  id,
  eyebrow,
  title,
  description,
  actions,
  tone = 'plain',
  align = 'center',
  className,
  children,
}: {
  id?: string
  eyebrow?: ReactNode
  title?: ReactNode
  description?: ReactNode
  actions?: ReactNode
  tone?: 'plain' | 'sunken'
  align?: 'center' | 'start'
  className?: string
  children?: ReactNode
}) {
  const headingId = id ? `${id}-heading` : undefined
  return (
    <section
      id={id}
      aria-labelledby={title ? headingId : undefined}
      className={cn('scroll-mt-header py-16 sm:py-24', tone === 'sunken' && 'border-y border-line bg-sunken', className)}
    >
      <Container>
        {(eyebrow || title || description) && (
          <div className={cn('mb-10 max-w-2xl sm:mb-14', align === 'center' && 'mx-auto text-center')}>
            {eyebrow && <p className="mb-3 text-sm font-bold tracking-wide text-brand uppercase">{eyebrow}</p>}
            {title && (
              <h2 id={headingId} className="text-3xl font-extrabold text-ink sm:text-4xl">
                {title}
              </h2>
            )}
            {description && <p className="mt-4 text-lg text-muted">{description}</p>}
            {actions && <div className={cn('mt-6 flex flex-wrap gap-3', align === 'center' && 'justify-center')}>{actions}</div>}
          </div>
        )}
        {children}
      </Container>
    </section>
  )
}
