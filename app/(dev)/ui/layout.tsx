// SHOWCASE LAYOUT: app/(dev)/ui/layout.tsx
//
// A fourth route group, "(dev)", with its own deliberately plain layout:
// a warning banner, a section index and nothing else, so the components
// are seen on their own, outside any product page. It's public (so it can
// be studied on the deployed site) but marked internal, kept out of search
// engines and not linked from any navigation.

import type { Metadata } from 'next'
import Link from 'next/link'
import { LogoMark } from '@/components/layout/logo'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { sections } from './sections'

export const metadata: Metadata = {
  title: 'Component library',
  robots: { index: false, follow: false },
}

export default function ShowcaseLayout({ children }: LayoutProps<'/ui'>) {
  return (
    <div className="min-h-dvh">
      <div role="note" className="bg-accent px-4 py-2 text-center text-sm font-semibold text-accent-ink">
        Internal component library: every Owó UI component in its variants and states. Not part of the product.
      </div>
      <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-gutter sm:px-gutter-lg">
          <LogoMark className="size-7" />
          <p className="font-display font-extrabold text-ink">
            Owó <span className="font-sans font-semibold text-muted">/ ui</span>
          </p>
          <Link href="/" className="ml-auto text-sm font-semibold text-muted hover:text-ink">
            Site
          </Link>
          <Link href="/dashboard" className="text-sm font-semibold text-muted hover:text-ink">
            App
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-10 px-gutter py-10 sm:px-gutter-lg lg:grid-cols-[12rem_minmax(0,1fr)]">
        <nav aria-label="Components" className="hidden lg:block">
          <ul className="sticky top-24 space-y-1 text-sm">
            {sections.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} className="block rounded-control px-3 py-1.5 text-muted hover:bg-sunken hover:text-ink">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <main id="main" tabIndex={-1} className="min-w-0 focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  )
}
