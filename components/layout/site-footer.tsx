import { cacheLife } from 'next/cache'
import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'
import { Container } from './container'
import { Logo } from './logo'
import { site } from '@/lib/site'

const columns = [
  {
    title: 'Product',
    links: [
      { href: '/features', label: 'Features' },
      { href: '/pricing', label: 'Pricing' },
      { href: '/changelog', label: 'Changelog' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/customers', label: 'Customers' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Get started',
    links: [
      { href: '/signup', label: 'Create an account' },
      { href: '/login', label: 'Sign in' },
      { href: '/pricing#faq', label: 'FAQ' },
    ],
  },
]

/**
 * With Cache Components, reading the clock during prerendering is an error
 * (the HTML would freeze one moment in time without saying so). 'use cache'
 * makes the decision explicit: this value may be reused for a day.
 */
async function CurrentYear() {
  'use cache'
  cacheLife('days')
  return <>{new Date().getFullYear()}</>
}

/** The big marketing footer. */
export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-sunken">
      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm text-muted">{site.description}</p>
          </div>
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="text-sm font-bold text-ink">{col.title}</h2>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted hover:text-ink hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-12 flex flex-col-reverse items-start justify-between gap-4 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:items-center">
          <p>
            © <CurrentYear /> {site.name}. A demo product: every business and person on this site is fictional.
          </p>
          <ThemeToggle />
        </div>
      </Container>
    </footer>
  )
}
