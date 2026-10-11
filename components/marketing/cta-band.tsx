import type { ReactNode } from 'react'
import { Container } from '@/components/layout/container'

/**
 * CtaBand: the bold brand-coloured "ready to start?" strip.
 * Title, text and `actions` are slots, so every page can end with its own
 * message and buttons in the same visual frame.
 */
export function CtaBand({ title, description, actions }: { title: ReactNode; description?: ReactNode; actions: ReactNode }) {
  return (
    <section aria-label="Get started" className="py-16 sm:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-card bg-brand px-6 py-12 text-center text-brand-ink shadow-raised sm:px-12 sm:py-16">
          {/* Decorative cowrie-gold rings. */}
          <div aria-hidden className="absolute -top-24 -right-20 size-72 rounded-pill border-[3rem] border-accent/20" />
          <div aria-hidden className="absolute -bottom-28 -left-16 size-64 rounded-pill border-[2.5rem] border-accent/15" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl font-extrabold sm:text-4xl">{title}</h2>
            {description && <p className="mx-auto mt-4 max-w-xl text-lg opacity-85">{description}</p>}
            <div className="mt-8 flex flex-wrap justify-center gap-3">{actions}</div>
          </div>
        </div>
      </Container>
    </section>
  )
}
