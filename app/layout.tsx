// ROOT LAYOUT (app/layout.tsx)
// The one layout every route shares: the marketing site, the auth screens,
// the app and the /ui showcase all render inside it. That is why it holds
// ONLY what every page needs: <html>/<body>, fonts, the theme set-up, the
// skip link and the toast region. A header, sidebar or footer would be wrong
// here, because each route group below brings its own.
//
// Route groups like (marketing) and (app) don't have to share a root layout,
// but sharing one means fonts and theme load once and a navigation from the
// landing page to /login never reloads the whole document.

import type { Metadata, Viewport } from 'next'
import { Epilogue, Reddit_Mono, Reddit_Sans } from 'next/font/google'
import { ToastProvider } from '@/components/ui/toast'
import { site, siteUrl } from '@/lib/site'
import { themeScript } from '@/lib/theme'
import './globals.css'

// next/font downloads the fonts at build time and serves them from this
// site: no request to Google from the visitor's browser and no layout jump
// when they load. All three were checked for the ₦ sign and Yoruba letters
// (ọ, ẹ, ṣ), which most popular sans-serifs are missing.
const epilogue = Epilogue({ subsets: ['latin', 'latin-ext'], variable: '--font-epilogue' })
const redditSans = Reddit_Sans({ subsets: ['latin', 'latin-ext'], variable: '--font-reddit-sans' })
const redditMono = Reddit_Mono({ subsets: ['latin'], variable: '--font-reddit-mono', preload: false })

// METADATA THROUGH LAYOUTS: every page inherits this. A page that exports
// `metadata = { title: 'Pricing' }` gets "Pricing · Owó" from the template;
// the home page, which sets no title, gets `default`.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name}: ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: { siteName: site.name, type: 'website', locale: 'en_NG' },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf7f2' },
    { media: '(prefers-color-scheme: dark)', color: '#0b1416' },
  ],
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en-NG"
      // Next.js disables smooth scrolling during route changes, so new pages
      // start at the top instantly while #anchor links still glide.
      data-scroll-behavior="smooth"
      // The <head> scripts (theme here, sidebar in the app layout) set
      // attributes on <html> before React loads, so the server's <html> and
      // the browser's differ on purpose. This silences that one warning.
      suppressHydrationWarning
      className={`${epilogue.variable} ${redditSans.variable} ${redditMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh antialiased">
        {/* SKIP LINK: the first Tab stop on every page. Each group's layout
            puts id="main" on its <main>, so this works everywhere. */}
        <a
          href="#main"
          className="sr-only z-[70] rounded-control bg-brand px-4 py-2 font-semibold text-brand-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  )
}
