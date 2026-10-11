// AUTH LAYOUT: app/(auth)/layout.tsx
//
// A second ROUTE GROUP with a completely different look: no marketing
// header or footer, just a centred card with the logo, and a brand panel
// with a customer quote. /login, /signup and /forgot-password all render
// inside it, and their URLs don't mention "(auth)".
//
// Because this is a LAYOUT, it stays mounted when you move between those
// three pages: the side panel doesn't re-render or re-animate. Only the
// card's contents change. (Compare template.tsx in this folder, which
// remounts on every one of those navigations.)

import Link from 'next/link'
import { Logo } from '@/components/layout/logo'
import { Testimonial } from '@/components/marketing/testimonial'
import { getTestimonials } from '@/lib/data'

export default async function AuthLayout({ children }: LayoutProps<'/'>) {
  const [quote] = await getTestimonials()
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_minmax(0,32rem)]">
      <div className="flex flex-col px-gutter py-6 sm:px-gutter-lg">
        <header className="flex items-center justify-between">
          <Logo />
          <Link href="/" className="text-sm font-semibold text-muted hover:text-ink">
            ← Back to site
          </Link>
        </header>
        <main id="main" tabIndex={-1} className="flex flex-1 items-center justify-center py-10 focus:outline-none">
          <div className="w-full max-w-md rounded-card border border-line bg-raised p-6 shadow-raised sm:p-8">{children}</div>
        </main>
        <p className="text-center text-xs text-subtle">
          Demo product. Sign-in is pretend: it sets a cookie and nothing else.
        </p>
      </div>

      {/* The brand panel: hidden on small screens, where the form matters most. */}
      <aside aria-label="What customers say" className="relative hidden overflow-hidden bg-brand p-12 lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:justify-end">
        <div aria-hidden className="absolute -top-32 -right-24 size-[28rem] rounded-pill border-[4rem] border-accent/15" />
        <div aria-hidden className="absolute top-40 -left-20 size-56 rounded-pill border-[2.5rem] border-accent/10" />
        <div className="relative">
          <p className="mb-6 font-display text-3xl leading-tight font-extrabold text-brand-ink">Invoices that get you paid.</p>
          <Testimonial testimonial={quote} tone="brand" />
        </div>
      </aside>
    </div>
  )
}
