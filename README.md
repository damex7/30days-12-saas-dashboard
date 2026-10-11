# Owó: invoicing for Nigerian freelancers

**Day 12 of my 30-day challenge.** Today's focus: **layouts and reusable components** in the Next.js App Router with
TypeScript. Yesterday (Day 11) was my first Next.js app and was about routing. Today builds on it.

Owó (Yoruba for "money") is a SaaS invoicing app for freelancers and small businesses in Nigeria. It has a **marketing
site**, **auth screens** and an **app dashboard**, three completely different layouts in one Next.js app. You can create
invoices in naira with 7.5% VAT, share them on WhatsApp, print them, and see who owes you what.

Built with **Next.js 16.4** (App Router, Turbopack, Cache Components), **React 19**, **TypeScript (strict)** and
**Tailwind CSS v4**. Components are my own (no UI kit), with `class-variance-authority` for variants and `lucide-react`
for icons.

> [!NOTE]
> **All data is sample content.** The business (Ọnà Design Studio), the 25 clients, the 80 invoices, the activity feed,
> the testimonials, customer stories and changelog are fictional, written or generated for this demo. Emails use the
> reserved `.example` domain, and "Share on WhatsApp" never includes a phone number.

> [!WARNING]
> **The sign-in is NOT real authentication.** Submitting the login or sign-up form with any well-formed email and a
> password of 8+ characters sets a cookie called `owo_demo` that only means "this browser clicked Sign in". It holds no
> user id, isn't signed, and anyone can create it in DevTools. It exists so the auth layouts, the proxy redirect and
> sign-out can be built today. Real accounts arrive on Day 16 with the database.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build; prints the route table
npm start          # serve the production build
npm run typecheck  # generates route types, then runs tsc --noEmit
npm run lint
```

**Demo login:** open `/login`. The demo details are already filled in (`kemi@onastudio.example` / `owo-demo-2026`), so
just press **Sign in**. Visiting any app page while signed out redirects to `/login?next=…` and back afterwards.

In development, `lib/data.ts` adds a small, different delay to each data call, so every loading skeleton and the
independently streaming dashboard panels are visible. Production has no delay.

### Things to try (the layout concepts, live)

| Try this | What it shows |
| --- | --- |
| Open `/dashboard` with `npm run dev` | Parallel routes: the stat cards, chart, activity and overdue list stream in separately |
| Open `/dashboard?fail=revenue` (or `stats`, `activity`) | One slot's `error.tsx` replaces only that panel; **Try again** calls `retry()` |
| Click an invoice in `/invoices`, then refresh | Intercepting route: a modal over the list, then the full page on refresh |
| Press **Esc** in that modal | `router.back()`: the URL returns to `/invoices` and focus goes back to the row |
| Switch tabs in `/settings` | Nested layout: the "Layout mounted 12s ago" counter keeps counting |
| Go from `/login` to `/signup` | `template.tsx`: the card fades in again (a layout wouldn't remount) |
| Collapse the sidebar, then reload | The choice is remembered and applied before the first paint, with no jump |
| Print an invoice (or Save as PDF) | Print stylesheet: only the invoice, on white, whatever the theme |
| Visit `/ui` | The component library, every component in every state |

## Layout map

Every `layout.tsx` and `template.tsx`, and what it wraps. Folders in `(brackets)` are **route groups**: they organise
files and give pages a layout, but never appear in the URL. Folders starting with `@` are **parallel route slots**.

```
app/layout.tsx  ROOT: <html>/<body>, fonts, no-flash theme script, skip link, toast region, title template "%s · Owó"
│
├─ app/(marketing)/layout.tsx  sticky header + big footer
│    /  /pricing  /features  /customers  /changelog  /contact
│
├─ app/(auth)/layout.tsx  centred card + logo + testimonial side panel
│  └─ app/(auth)/template.tsx  fade-in that replays on every navigation (remounts)
│       /login  /signup  /forgot-password
│
├─ app/(app)/layout.tsx  the app shell: collapsible sidebar, top bar (search, notifications, user menu), phone drawer
│  │    /reports  /clients  /clients/[id]
│  │
│  ├─ app/(app)/dashboard/layout.tsx  arranges 4 parallel slots at /dashboard
│  │      children  = dashboard/page.tsx           (overdue invoices to chase)
│  │      @stats    = dashboard/@stats/page.tsx    (4 stat cards)
│  │      @revenue  = dashboard/@revenue/page.tsx  (12-month chart)
│  │      @activity = dashboard/@activity/page.tsx (recent activity)
│  │      each slot has its own loading.tsx, error.tsx and default.tsx
│  │
│  ├─ app/(app)/invoices/layout.tsx  renders children + the @modal slot
│  │      children: /invoices  /invoices/new  /invoices/[id]
│  │      @modal:   (.)[id] intercepts /invoices/[id] → quick-view modal over the list
│  │                default.tsx, page.tsx, new/page.tsx → render nothing
│  │
│  └─ app/(app)/settings/layout.tsx  NESTED: page header + tab bar; only the tab content swaps
│         /settings → redirects to /settings/profile
│         /settings/profile  /settings/business  /settings/billing  /settings/team
│
└─ app/(dev)/ui/layout.tsx  plain showcase layout with an "internal" banner (noindex)
       /ui
```

Plus `proxy.ts` (the Next.js 16 name for middleware), which runs before all of this and redirects signed-out visitors
away from app routes.

### Where each layout concept lives

| Concept | File | Notes |
| --- | --- | --- |
| Root layout | `app/layout.tsx` | Only what every page needs. No header, because each group brings its own |
| Route groups | `app/(marketing)`, `(auth)`, `(app)`, `(dev)` | Four different layouts, no change to URLs |
| Nested layout | `app/(app)/settings/layout.tsx` | Root → app shell → settings → tab page |
| `template.tsx` vs `layout.tsx` | `app/(auth)/template.tsx` | Template remounts per navigation; layout persists |
| Parallel routes | `app/(app)/dashboard/@stats`, `@revenue`, `@activity` | Slots are props of `dashboard/layout.tsx` |
| `default.tsx` | `app/(app)/invoices/@modal/default.tsx` | Needed: on a hard load the slot has no match and would error |
| Intercepting route `(.)` | `app/(app)/invoices/@modal/(.)[id]/page.tsx` | `(.)` = same level, like `./` |
| `loading.tsx` | each data page, each slot, `[id]` routes, `settings/loading.tsx` | Skeletons shaped like the real page |
| `error.tsx` | each dashboard slot, `app/(app)/error.tsx`, `app/error.tsx` | Uses Next 16's `retry()` |
| `global-error.tsx` | `app/global-error.tsx` | Only when the root layout itself fails |
| `not-found.tsx` | `app/not-found.tsx`, `invoices/[id]/not-found.tsx`, `clients/[id]/not-found.tsx` | Specific messages inside the app shell |
| Metadata through layouts | root `title.template`, page `metadata`, `generateMetadata` in `[id]` pages, settings template | See "Lessons" on templates |
| Proxy (middleware) | `proxy.ts` | Demo-cookie redirect, plus the interception fix |
| URL as state | `app/(app)/invoices/page.tsx`, `lib/url.ts` | Status, search, sort and page all in the query string |

## Component library

Everything below is visible in every state at **`/ui`** (`app/(dev)/ui/page.tsx`). Server Components unless marked
**client**; each file has a short comment explaining its design.

| Component | File | What it shows |
| --- | --- | --- |
| Button | `components/ui/button.tsx` | cva variants (primary, secondary, ghost, danger) and sizes; `loading`; renders a `<Link>` when given `href` |
| SubmitButton (client) | `components/ui/submit-button.tsx` | Form pending state via `useFormStatus`, keeping Button a Server Component |
| Input, Textarea, Select, Checkbox, Switch | `components/ui/form-controls.tsx` | Native elements styled; invalid style keyed to `aria-invalid`; Switch is `role="switch"` |
| Field | `components/ui/field.tsx` | Label + hint + error wired with `aria-describedby`, via a render prop |
| Card, CardHeader, CardBody, CardFooter | `components/ui/card.tsx` | Composition with slots instead of boolean props |
| Badge, InvoiceStatusBadge | `components/ui/badge.tsx` | Tones; draft/sent/paid/overdue with shape + word, not colour alone |
| Avatar | `components/ui/avatar.tsx` | Initials with a colour derived from the name |
| Table, SortableHeader, TableEmpty | `components/ui/table.tsx` | Real table markup, URL-driven sorting with `aria-sort`, empty state slot |
| Tabs (client) | `components/ui/tabs.tsx` | ARIA tablist with arrow keys; panels can be server-rendered |
| LinkTabs | `components/ui/link-tabs.tsx` | Tabs that are URLs: a nav of links with `aria-current` |
| Dialog (client) | `components/ui/dialog.tsx` | Native `<dialog>` + `showModal()`; Esc, backdrop click, focus return; drawer variant |
| DropdownMenu (client) | `components/ui/dropdown-menu.tsx` | Menu button pattern: arrows, Home/End, typeahead, Esc returns focus; Server Action items |
| Tooltip (client) | `components/ui/tooltip.tsx` | Hover and focus, Esc to dismiss |
| Toast (client) | `components/ui/toast.tsx` | Provider in the root layout, always-present live region, pause on hover |
| Skeleton, LoadingRegion | `components/ui/skeleton.tsx` | Shimmer placeholders; one "Loading…" announcement per group |
| EmptyState | `components/ui/empty-state.tsx` | Icon, title, description and an action slot |
| Pagination | `components/ui/pagination.tsx` | Page links with `aria-current`; caller builds hrefs so other params are kept |
| Container, Section | `components/layout/container.tsx` | One gutter and max width; section heading slots |
| PageHeader | `components/layout/page-header.tsx` | Title, description, `actions` and `breadcrumb` slots |
| Sidebar (client), NavItem (client) | `components/layout/sidebar.tsx`, `nav-item.tsx` | Collapse to icons (remembered); active link via `usePathname` |
| TopBar, MobileNav (client), user menus | `components/layout/top-bar.tsx`, `mobile-nav.tsx`, `user-menus.tsx` | Server menus rendering client DropdownMenus, each in its own Suspense |
| StatCard | `components/app/stat-card.tsx` | Value + change vs last month, knows whether "up" is good |
| RevenueChart | `components/app/revenue-chart.tsx` | Plain SVG bars + HTML labels, plus a "show as table" fallback |
| InvoiceTable (DataTable) | `components/app/invoice-table.tsx` | Composed from Table; stretched-link rows; responsive columns |
| InvoiceDocument, InvoiceSummary | `components/app/invoice-document.tsx` | The printable invoice and the modal's compact version |
| ActivityFeed | `components/app/activity-feed.tsx` | Timeline of invoice events |
| PricingCard, BillingToggle (client) | `components/marketing/pricing-card.tsx`, `billing-toggle.tsx` | Both prices rendered on the server; CSS shows one |
| FeatureGrid, Testimonial, CtaBand, Faq | `components/marketing/*` | Faq is native `<details>`: an accordion with no JS |
| ProductShowcase | `components/marketing/product-showcase.tsx` | The landing "screenshot", built from the real dashboard components |

### Why slots and `children` instead of boolean props

Compare two ways to build a page header:

```tsx
// Boolean/config props: every new page needs a new prop.
<PageHeader title="Invoices" showNewButton newButtonHref="/invoices/new" newButtonLabel="New invoice" />

// Slots: the header doesn't know or care what goes in `actions`.
<PageHeader title="Invoices" actions={<Button href="/invoices/new"><Plus /> New invoice</Button>} />
```

With slots, `PageHeader`, `Card`, `EmptyState`, `PricingCard` (`cta`) and `CtaBand` stay small and never change when a
new page wants something different in them: one page puts a single button there, the invoice page puts a share link
and a print button, the settings layout puts a live counter. Composition also lets **Server Components pass rendered
content into Client Components**: `BillingToggle` wraps server-rendered pricing cards, `InvoiceModal` wraps the
server-rendered invoice summary, and `DemoForm` wraps server-rendered settings fields.

### Server vs Client Components

Everything is a Server Component unless it needs state, effects or browser APIs. Each `'use client'` file says why at
the top. The client ones are: the interactive primitives (Dialog, DropdownMenu, Tooltip, Tabs, Toast, SubmitButton),
anything reading the URL in the browser (NavItem, SettingsTabs), anything using localStorage (ThemeToggle, Sidebar),
the forms with live state (invoice form, contact form, auth forms), and error boundaries (React requires them to be
client-side).

## Design

- **Palette "Cowrie":** night-teal brand, cowrie-gold accent (cowries were money in West Africa long before coins),
  warm off-white. Status colours for paid/sent/overdue/draft.
- **Tokens defined once** in `app/globals.css` with Tailwind v4 `@theme`: colours, radii, shadows, shell spacing and
  animations. The default Tailwind palette is removed (`--color-*: initial`), so an off-brand `bg-blue-600` simply
  doesn't exist. Each colour holds its light and dark value in `light-dark()`, so components never need `dark:` classes.
- **Dark mode with no flash:** follows the system by default; a manual choice is saved and applied by a tiny script
  before the first paint.
- **Fonts:** Epilogue (headings), Reddit Sans (text) and Reddit Mono (numbers), chosen after checking each font's
  character table for the **₦** sign and Yoruba letters (ọ, ẹ, ṣ) and for tabular figures. Most popular sans-serifs
  (Geist, DM Sans, Manrope, Figtree…) are missing ₦ or ṣ.
- **Accessibility:** landmarks on every layout, a skip link, visible gold focus rings, focus returned when dialogs and
  menus close, errors linked to their fields, an error summary on the invoice form, status shown by shape and word as
  well as colour, `prefers-reduced-motion` respected everywhere. Works down to 360px wide.

### Two choices I was asked to explain

- **cva over a hand-written variants helper.** It's tiny, gives typed `VariantProps` (so `variant="primery"` is a type
  error), defaults and compound variants. A homemade helper would re-implement exactly that. `lib/cn.ts` (clsx +
  tailwind-merge) I did write myself: it lets `className` overrides win over a component's defaults.
- **Plain SVG over Recharts for the chart.** Twelve pairs of bars is a few lines of maths. As SVG it's a Server
  Component: no client JavaScript, it's in the first HTML, and it prints. Recharts would add a client boundary and
  ~100 KB for a chart that never changes on screen. Text labels are HTML on top of the SVG, so they stay readable at
  360px.

## Data and money

- **All data goes through `lib/data.ts`.** It is the only module that reads `/data`, and it's marked `server-only`.
  App reads call `connection()` (request-time, because invoices change and dates are relative to today) and stream in
  behind `loading.tsx`. Marketing content uses `'use cache'`, so marketing pages are static HTML.
- **Money is integer kobo** (`lib/money.ts`, same approach as my Day 9 storefront). `formatNaira()` is the only place
  kobo becomes text. VAT is 7.5% stored as 750 basis points, applied once to the subtotal and rounded once.
- **Totals are calculated, never stored** (`lib/invoices.ts`). So is "overdue": a sent invoice past its due date. The
  same `invoiceTotals()` runs on the server and in the browser for the live total on `/invoices/new`.
- **Seed data:** 25 hand-written clients and 80 invoices generated by a seeded random generator (same invoices every
  run), dated relative to today so the dashboard never goes stale.
- **New invoices** are saved to an in-memory array in the server process. It's lost when the server restarts, and on
  Vercel different serverless instances don't share it. Good enough for a demo.

### Day 16: swapping in a database

`lib/data.ts` was written for this. Each exported function (`listInvoices`, `getInvoice`, `getDashboardStats`,
`createInvoice`…) keeps its name, arguments and return type; only its **body** changes from "filter the sample arrays"
to a database query. The pages, layouts and components never import `/data` directly, so none of them change. Real
auth will replace the demo cookie in the same place: the data layer will check who is asking, not just the proxy.

## Lessons from today

- **Route groups can't share a URL.** Both the marketing site and the app wanted `/customers`; the build would fail.
  The app's list became **`/clients`**.
- **Title templates don't stack.** A page title fills only the *nearest* template. The settings layout's template had
  to be `'%s · Settings · Owó'`; with `'%s · Settings'` the tab read just "Team · Settings".
- **Interception ignores static-segment priority.** `@modal/(.)[id]` also caught `/invoices/new`, opening an "Invoice
  not found" modal. Next.js decides to intercept from the `Next-Url` request header, so `proxy.ts` removes it for that
  one path.
- **Next.js 16 checks route completeness.** The docs' `@modal/[...catchAll]` pattern was rejected because the
  `children` slot had no matching pages for every URL it covered. An explicit `@modal/new/page.tsx` replaced it.
- **A Server Component can't import values from a `'use client'` file.** It gets a client reference, not the array
  (`marketingLinks.map is not a function`). Shared data lives in plain modules.
- **Absolutely positioned children escape scroll containers** unless the scroller is positioned. `sr-only` text in a
  wide table made the whole page scroll sideways on phones until the table wrapper got `relative`.
- **Grid items default to `min-width: auto`.** A single-column grid grew to the width of the table inside it;
  `grid-cols-1` (which is `minmax(0, 1fr)`) fixed it.

## Project structure

```
app/            routes: layouts, pages, loading/error/not-found, Server Actions
components/ui   the design system primitives
components/layout   shell and site chrome (Container, PageHeader, Sidebar, TopBar…)
components/app      product components for the dashboard
components/marketing  product components for the marketing site
data/           typed sample data (read only by lib/data.ts)
lib/            data access, money, dates, invoice maths, URL helpers, theme
proxy.ts        demo auth redirect + interception fix
```

## Deploy

Deploys to Vercel with zero configuration: import the repository and use the defaults.
