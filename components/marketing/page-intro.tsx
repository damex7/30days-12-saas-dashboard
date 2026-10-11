import type { ReactNode } from 'react'
import { Container } from '@/components/layout/container'

/**
 * PageIntro: the big centred heading at the top of a marketing page. It's
 * the page's <h1> (Section uses <h2>), so each page has exactly one.
 */
export function PageIntro({ eyebrow, title, description, children }: { eyebrow?: ReactNode; title: ReactNode; description?: ReactNode; children?: ReactNode }) {
  return (
    <div className="relative overflow-hidden border-b border-line">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(50rem_22rem_at_50%_-20%,var(--color-brand-soft),transparent_70%)]" />
      <Container className="animate-rise py-16 text-center sm:py-20">
        {eyebrow && <p className="mb-3 text-sm font-bold tracking-wide text-brand uppercase">{eyebrow}</p>}
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold text-ink sm:text-5xl">{title}</h1>
        {description && <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">{description}</p>}
        {children && <div className="mt-8">{children}</div>}
      </Container>
    </div>
  )
}
