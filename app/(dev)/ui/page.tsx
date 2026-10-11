import { AlertTriangle, FileSearch, Inbox, Plus, Send, Wallet } from 'lucide-react'
import type { ReactNode } from 'react'
import { ActivityFeed } from '@/components/app/activity-feed'
import { InvoiceTable } from '@/components/app/invoice-table'
import { RevenueChart } from '@/components/app/revenue-chart'
import { StatCard } from '@/components/app/stat-card'
import { PageHeader } from '@/components/layout/page-header'
import { CtaBand } from '@/components/marketing/cta-band'
import { FeatureGrid } from '@/components/marketing/feature-grid'
import { PricingCard } from '@/components/marketing/pricing-card'
import { Testimonial } from '@/components/marketing/testimonial'
import { Avatar } from '@/components/ui/avatar'
import { Badge, InvoiceStatusBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardBody, CardFooter, CardHeader } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Field } from '@/components/ui/field'
import { Checkbox, Input, Select, Switch, Textarea } from '@/components/ui/form-controls'
import { LinkTabs } from '@/components/ui/link-tabs'
import { Pagination } from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { SortableHeader, Table, TableEmpty, TBody, TD, TH, THead, TR } from '@/components/ui/table'
import { Tabs } from '@/components/ui/tabs'
import { getFeatures, getPlans, getShowcase, getTestimonials } from '@/lib/data'
import { formatNaira } from '@/lib/money'
import { INVOICE_STATUSES, type ActivityItem } from '@/lib/types'
import { DialogDemo, DropdownDemo, LoadingButtonDemo, ToastDemo, TooltipDemo } from './demos'
import { sections } from './sections'

/** One showcase section: title, the file it lives in, notes and the live examples. */
function Showcase({ id, file, notes, children }: { id: (typeof sections)[number][0]; file: string; notes?: ReactNode; children: ReactNode }) {
  const title = sections.find(([s]) => s === id)?.[1]
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24 border-t border-line py-12 first:border-0 first:pt-0">
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id={`${id}-title`} className="text-2xl font-extrabold text-ink">
          {title}
        </h2>
        <code className="rounded-control bg-sunken px-2 py-1 font-mono text-xs text-muted">{file}</code>
      </div>
      {notes && <p className="mb-6 max-w-3xl text-muted">{notes}</p>}
      <div className="flex flex-col gap-8">{children}</div>
    </section>
  )
}

/** A labelled example inside a section. */
function Example({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div>
      <h3 className="mb-3 font-sans text-xs font-bold tracking-wide text-subtle uppercase">{label}</h3>
      <div className={className ?? 'flex flex-wrap items-center gap-3'}>{children}</div>
    </div>
  )
}

const colourTokens = [
  'surface', 'raised', 'sunken', 'line', 'line-strong', 'ink', 'muted', 'subtle',
  'brand', 'brand-hover', 'brand-soft', 'accent', 'accent-soft',
  'paid', 'sent', 'overdue', 'draft', 'danger', 'focus',
]

const sampleActivity: ActivityItem[] = [
  { id: 'a1', type: 'paid', date: '2026-10-10', invoiceId: 'INV-0074', clientName: 'Naija Pixel Labs', amount: 64_500_000 },
  { id: 'a2', type: 'viewed', date: '2026-10-09', invoiceId: 'INV-0078', clientName: 'Plateau Highlands Tea', amount: 79_550_000 },
  { id: 'a3', type: 'reminder', date: '2026-10-08', invoiceId: 'INV-0075', clientName: 'Wazobia Tutors', amount: 48_000_000 },
  { id: 'a4', type: 'created', date: '2026-10-02', invoiceId: 'INV-0079', clientName: 'Eko Bites', amount: 20_000_000 },
]

// THE COMPONENT LIBRARY PAGE. A Server Component: static examples render
// here, interactive ones come from ./demos (Client Components). All the
// data is cached sample data, so the page is prerendered at build time.
export default async function ComponentLibrary() {
  const [showcase, plans, features, testimonials] = await Promise.all([getShowcase(), getPlans(), getFeatures(), getTestimonials()])

  return (
    <>
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold text-ink">Component library</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted">
          Every reusable component in Owó, in its variants and states. Each section names the file it lives in. Try it with the
          keyboard and in dark mode (toggle at the top).
        </p>
      </header>

      <Showcase id="tokens" file="app/globals.css (@theme)" notes="Defined once with Tailwind v4 @theme. Each colour holds its light and dark value via light-dark(), so components never need dark: classes.">
        <Example label="Colours" className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {colourTokens.map((t) => (
            <div key={t} className="flex items-center gap-3 rounded-control border border-line bg-raised p-2">
              <span className="size-9 shrink-0 rounded-control border border-line" style={{ background: `var(--color-${t})` }} />
              <code className="font-mono text-xs text-ink">{t}</code>
            </div>
          ))}
        </Example>
        <Example label="Radii and shadows">
          {[
            ['rounded-control shadow-card', 'control · card'],
            ['rounded-card shadow-raised', 'card · raised'],
            ['rounded-card shadow-pop', 'card · pop'],
            ['rounded-pill shadow-card', 'pill · card'],
          ].map(([cls, label]) => (
            <div key={label} className={`grid h-20 w-36 place-items-center border border-line bg-raised text-xs text-muted ${cls}`}>
              {label}
            </div>
          ))}
        </Example>
        <Example label="Type" className="space-y-2">
          <p className="font-display text-4xl font-extrabold text-ink">Epilogue for headings · ₦1,250,000</p>
          <p className="text-lg text-ink">Reddit Sans for text: Ọnà Design Studio, Ìtàn Books, Ọ̀ṣun Spa.</p>
          <p className="font-mono text-ink">Reddit Mono for numbers: INV-0042 · 0123456789</p>
        </Example>
      </Showcase>

      <Showcase id="button" file="components/ui/button.tsx" notes="Variants and sizes come from one cva table. With href it renders a Next.js Link; loading keeps the label and sets aria-busy.">
        <Example label="Variants">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </Example>
        <Example label="Sizes">
          <Button size="sm">Small</Button>
          <Button>Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" variant="secondary" aria-label="Add">
            <Plus aria-hidden />
          </Button>
        </Example>
        <Example label="States">
          <Button loading>Saving…</Button>
          <Button variant="secondary" loading>
            Loading
          </Button>
          <Button disabled>Disabled</Button>
          <LoadingButtonDemo />
        </Example>
        <Example label="As a link (href)">
          <Button href="/ui#button">
            <Send aria-hidden /> Link styled as a button
          </Button>
          <Button href="/ui#button" variant="secondary">
            Secondary link
          </Button>
        </Example>
      </Showcase>

      <Showcase id="forms" file="components/ui/form-controls.tsx · field.tsx" notes="Native elements, styled. Field wires label, hint and error to the control with aria-describedby and aria-invalid.">
        <Example label="Field states" className="grid grid-cols-1 max-w-3xl gap-5 sm:grid-cols-2">
          <Field name="ui-default" label="Default">
            {(c) => <Input {...c} placeholder="Placeholder text" />}
          </Field>
          <Field name="ui-hint" label="With a hint" hint="We’ll send receipts here.">
            {(c) => <Input {...c} type="email" defaultValue="kemi@onastudio.example" />}
          </Field>
          <Field name="ui-error" label="With an error" error="That email doesn’t look right." required>
            {(c) => <Input {...c} defaultValue="kemi@onastudio" />}
          </Field>
          <Field name="ui-disabled" label="Disabled">
            {(c) => <Input {...c} disabled defaultValue="Can’t touch this" />}
          </Field>
          <Field name="ui-select" label="Select">
            {(c) => (
              <Select {...c} defaultValue="14">
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
              </Select>
            )}
          </Field>
          <Field name="ui-textarea" label="Textarea">
            {(c) => <Textarea {...c} rows={2} defaultValue="Thank you for your business!" />}
          </Field>
        </Example>
        <Example label="Checkbox and Switch" className="grid grid-cols-1 max-w-3xl gap-5 sm:grid-cols-2">
          <div className="space-y-3">
            <Checkbox id="ui-check-1" label="Checked" defaultChecked />
            <Checkbox id="ui-check-2" label="With a description" description="Extra detail sits under the label." />
            <Checkbox id="ui-check-3" label="Disabled" disabled />
          </div>
          <div className="space-y-4">
            <Switch id="ui-switch-1" label="Add VAT (7.5%)" description="role=switch on a real checkbox" defaultChecked />
            <Switch id="ui-switch-2" label="Off" />
            <Switch id="ui-switch-3" label="Disabled" disabled />
          </div>
        </Example>
      </Showcase>

      <Showcase id="card" file="components/ui/card.tsx" notes="Built from slots: CardHeader (title, description, actions), CardBody, CardFooter. Use the pieces you need.">
        <Example label="Header + body + footer" className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader title="Payment details" description="Shown on every invoice." actions={<Badge tone="brand">Default</Badge>} />
            <CardBody className="text-sm text-muted">Example Bank · 0123456789</CardBody>
            <CardFooter className="justify-end">
              <Button size="sm" variant="ghost">
                Cancel
              </Button>
              <Button size="sm">Save</Button>
            </CardFooter>
          </Card>
          <Card className="p-5 text-sm text-muted">A Card with no header or footer is just a padded panel.</Card>
        </Example>
      </Showcase>

      <Showcase id="badge" file="components/ui/badge.tsx" notes="Status badges pair a colour with a distinct shape and the word, so they work without colour too.">
        <Example label="Invoice statuses">
          {INVOICE_STATUSES.map((s) => (
            <InvoiceStatusBadge key={s} status={s} />
          ))}
        </Example>
        <Example label="Tones">
          <Badge>Neutral</Badge>
          <Badge tone="brand">Brand</Badge>
          <Badge tone="accent">Accent</Badge>
        </Example>
      </Showcase>

      <Showcase id="avatar" file="components/ui/avatar.tsx" notes="Initials on a colour derived from the name, so the same client always looks the same.">
        <Example label="Sizes and names">
          <Avatar name="Kémi Adébáyọ̀" size="sm" />
          <Avatar name="Coal City Coffee" />
          <Avatar name="Ọ̀ṣun Spa & Wellness" size="lg" />
          <Avatar name="Delta Sun Solar" size="lg" />
        </Example>
      </Showcase>

      <Showcase id="table" file="components/ui/table.tsx" notes="Real <table> markup. SortableHeader is a link that sets ?sort=&dir= and aria-sort; TableEmpty holds an EmptyState.">
        <Example label="Sortable header + rows" className="block">
          <Card>
            <Table caption="Example table" captionHidden>
              <THead>
                <TR>
                  <SortableHeader label="Client" sortKey="client" currentSort="total" currentDir="desc" hrefFor={() => '#table'} />
                  <SortableHeader label="Amount" sortKey="total" currentSort="total" currentDir="desc" hrefFor={() => '#table'} align="right" />
                  <TH>Status</TH>
                </TR>
              </THead>
              <TBody>
                {showcase.recent.slice(0, 3).map((inv) => (
                  <TR key={inv.id}>
                    <TD>{inv.client.name}</TD>
                    <TD align="right">{formatNaira(inv.total)}</TD>
                    <TD>
                      <InvoiceStatusBadge status={inv.status} />
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </Card>
        </Example>
        <Example label="Empty" className="block">
          <Card>
            <Table caption="Empty table" captionHidden>
              <THead>
                <TR>
                  <TH>Invoice</TH>
                  <TH>Status</TH>
                </TR>
              </THead>
              <TBody>
                <TableEmpty colSpan={2}>
                  <EmptyState icon={<FileSearch />} title="No invoices match" description="Try a different search." />
                </TableEmpty>
              </TBody>
            </Table>
          </Card>
        </Example>
      </Showcase>

      <Showcase id="tabs" file="components/ui/tabs.tsx · link-tabs.tsx" notes="Tabs switch panels in the same page (ARIA tablist, arrow keys). LinkTabs are navigation between URLs (a nav of links with aria-current).">
        <Example label="Tabs (try ← → Home End)" className="block max-w-2xl">
          <Tabs
            label="Example tabs"
            items={[
              { value: 'one', label: 'Overview', panel: <p className="text-muted">Panels can be Server Components passed in as props.</p> },
              { value: 'two', label: 'Line items', panel: <p className="text-muted">Only the selected tab is in the Tab order.</p> },
              { value: 'three', label: 'History', panel: <p className="text-muted">Hidden panels use the hidden attribute.</p> },
            ]}
          />
        </Example>
        <Example label="LinkTabs" className="block max-w-2xl">
          <LinkTabs
            label="Example link tabs"
            current="sent"
            items={[
              { key: 'all', href: '#tabs', label: 'All', count: 80 },
              { key: 'sent', href: '#tabs', label: 'Sent', count: 3 },
              { key: 'paid', href: '#tabs', label: 'Paid', count: 71 },
            ]}
          />
        </Example>
      </Showcase>

      <Showcase id="dialog" file="components/ui/dialog.tsx" notes="Built on the native <dialog> element: showModal() makes the rest of the page inert, Esc closes, and focus returns to the opener.">
        <Example label="Open one">
          <DialogDemo />
        </Example>
      </Showcase>

      <Showcase id="dropdown" file="components/ui/dropdown-menu.tsx" notes="The WAI-ARIA menu button: Enter/Space/↓ opens, ↑↓ Home End move, letters jump, Esc closes and returns focus.">
        <Example label="Menus">
          <DropdownDemo />
        </Example>
      </Showcase>

      <Showcase id="tooltip" file="components/ui/tooltip.tsx" notes="Appears on hover and on keyboard focus, dismisses with Esc. Used for the collapsed sidebar.">
        <Example label="Sides">
          <TooltipDemo />
        </Example>
      </Showcase>

      <Showcase id="toast" file="components/ui/toast.tsx" notes="One provider in the root layout; an always-present aria-live region announces each toast. Pauses on hover/focus.">
        <Example label="Trigger">
          <ToastDemo />
        </Example>
      </Showcase>

      <Showcase id="skeleton" file="components/ui/skeleton.tsx" notes="Placeholders shaped like the real content. Grouped in a LoadingRegion that announces “Loading…” once.">
        <Example label="A stat card loading" className="max-w-xs">
          <Card className="flex w-full flex-col gap-3 p-5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-4 w-32" />
          </Card>
        </Example>
      </Showcase>

      <Showcase id="empty" file="components/ui/empty-state.tsx" notes="Says what would be here and offers the next step via the action slot.">
        <Example label="With an action" className="block">
          <Card>
            <EmptyState icon={<Inbox />} title="No invoices yet" description="Create your first invoice and it will show up here." action={<Button>New invoice</Button>} />
          </Card>
        </Example>
      </Showcase>

      <Showcase id="pagination" file="components/ui/pagination.tsx" notes="Links, not buttons: each page is a URL. The caller supplies hrefFor so other query params are kept.">
        <Example label="Page 4 of 9" className="block">
          <Pagination page={4} pageCount={9} hrefFor={() => '#pagination'} />
        </Example>
        <Example label="First page (Previous disabled)" className="block">
          <Pagination page={1} pageCount={3} hrefFor={() => '#pagination'} />
        </Example>
      </Showcase>

      <Showcase id="product" file="components/app · components/marketing · components/layout" notes="Product components composed from the primitives above.">
        <Example label="PageHeader (actions slot)" className="block">
          <PageHeader
            level={2}
            title="Invoices"
            description="Everything you’ve billed."
            actions={
              <>
                <Button variant="secondary">Export</Button>
                <Button>
                  <Plus aria-hidden /> New invoice
                </Button>
              </>
            }
          />
        </Example>
        <Example label="StatCard: good up, bad up, no change" className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard label="Revenue this month" value={formatNaira(211_237_500)} icon={<Wallet />} change={{ current: 187, previous: 100, higherIsBetter: true, unit: 'percent' }} />
          <StatCard label="Overdue" value={formatNaira(403_587_500)} icon={<AlertTriangle />} change={{ current: 108, previous: 100, higherIsBetter: false, unit: 'percent' }} />
          <StatCard label="Paid on time" value="67%" change={{ current: 67, previous: 67, higherIsBetter: true, unit: 'points' }} hint="No change" />
        </Example>
        <Example label="RevenueChart (plain SVG)" className="block">
          <Card className="p-5">
            <RevenueChart months={showcase.months} />
          </Card>
        </Example>
        <Example label="InvoiceTable + ActivityFeed" className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
          <Card>
            <InvoiceTable invoices={showcase.recent} caption="Recent invoices" />
          </Card>
          <Card className="p-5">
            <ActivityFeed items={sampleActivity} today="2026-10-11" />
          </Card>
        </Example>
        <Example label="PricingCard (cta slot)" className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} cta={<Button block variant={plan.featured ? 'primary' : 'secondary'}>{plan.cta}</Button>} />
          ))}
        </Example>
        <Example label="FeatureGrid" className="block">
          <FeatureGrid features={features.slice(0, 3)} />
        </Example>
        <Example label="Testimonial: card and brand tones" className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Testimonial testimonial={testimonials[1]} showResult />
          <div className="rounded-card bg-brand p-6">
            <Testimonial testimonial={testimonials[2]} tone="brand" />
          </div>
        </Example>
        <Example label="CtaBand" className="-mx-gutter block sm:-mx-gutter-lg">
          <CtaBand title="Your next invoice could be paid this week" actions={<Button className="bg-accent text-accent-ink hover:bg-accent/90">Start free</Button>} />
        </Example>
        <p className="text-sm text-muted">
          Sidebar, NavItem, TopBar and the menus need the app shell around them; see them live in the app at{' '}
          <a href="/dashboard" className="font-semibold text-brand underline">
            /dashboard
          </a>
          .
        </p>
      </Showcase>
    </>
  )
}
