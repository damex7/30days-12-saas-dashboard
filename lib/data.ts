// THE DATA ACCESS LAYER. Every page and component gets data from here and
// nowhere else; nothing outside this file imports /data directly.
//
// Today the functions read typed sample data from /data. On Day 16 their
// BODIES become database queries while their names, arguments and return
// types stay the same, so no page has to change. That is the whole point of
// routing every read through one module.
//
// `server-only` makes it a build error to import this file into a Client
// Component, so database code can never end up in the browser bundle.
import 'server-only'

import { cacheLife } from 'next/cache'
import { connection } from 'next/server'
import { seedActivity } from '@/data/activity'
import { business } from '@/data/business'
import { clients } from '@/data/clients'
import { seedInvoices } from '@/data/invoices'
import { changelog, comparison, faqs, features, logoWordmarks, plans, testimonials } from '@/data/marketing'
import { addDays, daysBetween, monthKey, monthsBefore, todayInLagos } from '@/lib/dates'
import { daysOverdue, effectiveStatus, invoiceTotals } from '@/lib/invoices'
import { sumKobo } from '@/lib/money'
import type {
  ActivityItem,
  Client,
  ClientSummary,
  ISODate,
  Invoice,
  InvoicePage,
  InvoiceQuery,
  InvoiceStatus,
  InvoiceView,
  LineItem,
  MonthRevenue,
  Notification,
  SortKey,
  Stat,
} from '@/lib/types'

// ---------------------------------------------------------------------------
// Plumbing
// ---------------------------------------------------------------------------

/**
 * A pretend network delay, ONLY in development, so loading.tsx skeletons and
 * the independently streaming dashboard panels are visible while you work.
 * Each function uses a different delay so panels arrive at different times.
 */
function devDelay(ms: number) {
  if (process.env.NODE_ENV !== 'development') return Promise.resolve()
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

/**
 * Every app read starts here. `connection()` tells Next.js "this needs the
 * live request": the data can change (new invoices) and dates are relative
 * to today, so it must never be baked into the build. With Cache Components,
 * that makes the caller stream in behind the nearest <Suspense> or
 * loading.tsx, which is exactly where our skeletons live.
 */
async function requestToday(delayMs: number): Promise<ISODate> {
  await connection()
  await devDelay(delayMs)
  return todayInLagos()
}

// IN-MEMORY STORE for invoices created in this session from /invoices/new.
// It lives in this server process only: restarting `npm run dev`, a new
// deployment or a different serverless instance on Vercel starts empty.
// Good enough for a demo; a real database replaces it on Day 16.
const createdInvoices: Invoice[] = []

// The seed depends on today's date, so it is rebuilt at most once a day.
let seedMemo: { day: ISODate; invoices: Invoice[] } | null = null
function seed(today: ISODate) {
  if (seedMemo?.day !== today) seedMemo = { day: today, invoices: seedInvoices(today) }
  return seedMemo.invoices
}

const clientsById = new Map(clients.map((c) => [c.id, c]))

function allInvoices(today: ISODate): Invoice[] {
  return [...seed(today), ...createdInvoices]
}

function toView(inv: Invoice, today: ISODate): InvoiceView {
  const client = clientsById.get(inv.clientId)
  if (!client) throw new Error(`Invoice ${inv.id} points at unknown client ${inv.clientId}`)
  return {
    ...inv,
    ...invoiceTotals(inv.items, inv.applyVat),
    status: effectiveStatus(inv, today),
    client,
    daysOverdue: daysOverdue(inv, today),
  }
}

const views = (today: ISODate) => allInvoices(today).map((inv) => toView(inv, today))

/** Was this invoice sent and still unpaid on `date`? (Lets us compare with last month.) */
const unpaidOn = (inv: InvoiceView, date: ISODate) =>
  inv.status !== 'draft' && inv.issueDate <= date && !(inv.paidDate && inv.paidDate <= date)

// ---------------------------------------------------------------------------
// App reads (request-time)
// ---------------------------------------------------------------------------

export async function getBusiness() {
  await requestToday(150)
  return business
}

/** The four headline numbers on the dashboard, each with last month's value. */
export async function getDashboardStats(): Promise<Stat[]> {
  const today = await requestToday(700)
  const all = views(today)
  const sameDayLastMonth = addDays(today, -30)
  const thisMonth = monthKey(today)
  const lastMonth = monthsBefore(today, 1)
  const dayOfMonth = Number(today.slice(8, 10))

  // Revenue collected month-to-date vs the same days of last month.
  const collected = (month: string, uptoDay: number) =>
    sumKobo(
      all
        .filter((i) => i.paidDate && monthKey(i.paidDate) === month && Number(i.paidDate.slice(8, 10)) <= uptoDay)
        .map((i) => i.total),
    )

  const outstandingOn = (date: ISODate) => sumKobo(all.filter((i) => unpaidOn(i, date)).map((i) => i.total))
  const overdueOn = (date: ISODate) =>
    sumKobo(all.filter((i) => unpaidOn(i, date) && i.dueDate < date).map((i) => i.total))

  // Paid on time: of invoices paid in a 30-day window, the share paid by the due date.
  const onTimeRate = (from: ISODate, to: ISODate) => {
    const paid = all.filter((i) => i.paidDate && i.paidDate > from && i.paidDate <= to)
    if (!paid.length) return 0
    return Math.round((paid.filter((i) => i.paidDate! <= i.dueDate).length / paid.length) * 100)
  }

  return [
    {
      label: 'Revenue this month',
      value: collected(thisMonth, dayOfMonth),
      previous: collected(lastMonth, dayOfMonth),
      format: 'money',
      higherIsBetter: true,
      hint: 'Collected so far, vs the same days last month',
    },
    {
      label: 'Outstanding',
      value: outstandingOn(today),
      previous: outstandingOn(sameDayLastMonth),
      format: 'money',
      higherIsBetter: false,
      hint: 'Sent and not yet paid',
    },
    {
      label: 'Overdue',
      value: overdueOn(today),
      previous: overdueOn(sameDayLastMonth),
      format: 'money',
      higherIsBetter: false,
      hint: 'Past the due date',
    },
    {
      label: 'Paid on time',
      value: onTimeRate(addDays(today, -30), today),
      previous: onTimeRate(addDays(today, -60), addDays(today, -30)),
      format: 'percent',
      higherIsBetter: true,
      hint: 'Share of invoices paid by the due date, last 30 days',
    },
  ]
}

function monthlyRevenue(all: InvoiceView[], today: ISODate): MonthRevenue[] {
  return Array.from({ length: 12 }, (_, n) => {
    const month = monthsBefore(today, 11 - n)
    return {
      month,
      label: month,
      invoiced: sumKobo(all.filter((i) => i.status !== 'draft' && monthKey(i.issueDate) === month).map((i) => i.total)),
      collected: sumKobo(all.filter((i) => i.paidDate && monthKey(i.paidDate) === month).map((i) => i.total)),
    }
  })
}

/** Invoiced and collected totals for each of the last 12 months, oldest first. */
export async function getMonthlyRevenue(): Promise<MonthRevenue[]> {
  const today = await requestToday(1400)
  return monthlyRevenue(views(today), today)
}

export async function getActivity(limit = 8): Promise<{ items: ActivityItem[]; today: ISODate }> {
  const today = await requestToday(1000)
  const items = seedActivity(views(today), today).slice(0, limit)
  return { items, today }
}

export async function getNotifications(): Promise<{ items: Notification[]; today: ISODate }> {
  const today = await requestToday(400)
  const items = seedActivity(views(today), today)
    .filter((a) => a.type === 'paid' || a.type === 'viewed' || a.type === 'reminder')
    .slice(0, 6)
    .map((a) => ({ ...a, unread: daysBetween(a.date, today) <= 3 }))
  return { items, today }
}

/** Overdue invoices to chase, most overdue first. */
export async function getOverdueInvoices(limit = 6): Promise<InvoiceView[]> {
  const today = await requestToday(500)
  return views(today)
    .filter((i) => i.status === 'overdue')
    .sort((a, b) => b.daysOverdue - a.daysOverdue)
    .slice(0, limit)
}

export const INVOICE_PAGE_SIZE = 10

const sorters: Record<SortKey, (a: InvoiceView, b: InvoiceView) => number> = {
  number: (a, b) => a.id.localeCompare(b.id),
  client: (a, b) => a.client.name.localeCompare(b.client.name),
  issueDate: (a, b) => a.issueDate.localeCompare(b.issueDate),
  dueDate: (a, b) => a.dueDate.localeCompare(b.dueDate),
  total: (a, b) => a.total - b.total,
  status: (a, b) => a.status.localeCompare(b.status),
}

/** Filter, search, sort and paginate invoices. Every option comes from the URL. */
export async function listInvoices(query: InvoiceQuery = {}): Promise<InvoicePage> {
  const today = await requestToday(600)
  const q = query.q?.trim().toLowerCase()

  const searched = views(today).filter(
    (i) =>
      !q ||
      i.id.toLowerCase().includes(q) ||
      i.client.name.toLowerCase().includes(q) ||
      i.items.some((item) => item.description.toLowerCase().includes(q)),
  )

  // Tab counts reflect the search but not the status filter, so each tab
  // shows how many results you'd get by switching to it.
  const counts = { all: searched.length, draft: 0, sent: 0, paid: 0, overdue: 0 } satisfies InvoicePage['counts']
  for (const i of searched) counts[i.status]++

  const filtered = query.status ? searched.filter((i) => i.status === query.status) : searched
  const sort = query.sort ?? 'issueDate'
  const dir = query.dir ?? (query.sort ? 'asc' : 'desc')
  const sorted = [...filtered].sort((a, b) => sorters[sort](a, b) * (dir === 'asc' ? 1 : -1) || b.id.localeCompare(a.id))

  const pageCount = Math.max(1, Math.ceil(sorted.length / INVOICE_PAGE_SIZE))
  const page = Math.min(Math.max(1, query.page ?? 1), pageCount)
  return {
    items: sorted.slice((page - 1) * INVOICE_PAGE_SIZE, page * INVOICE_PAGE_SIZE),
    total: sorted.length,
    page,
    pageCount,
    pageSize: INVOICE_PAGE_SIZE,
    counts,
  }
}

export async function getInvoice(id: string): Promise<InvoiceView | null> {
  const today = await requestToday(500)
  const inv = allInvoices(today).find((i) => i.id.toLowerCase() === id.toLowerCase())
  return inv ? toView(inv, today) : null
}

function summarise(client: Client, invoices: InvoiceView[]): ClientSummary {
  const own = invoices.filter((i) => i.clientId === client.id)
  return {
    ...client,
    invoiceCount: own.length,
    billed: sumKobo(own.filter((i) => i.status !== 'draft').map((i) => i.total)),
    outstanding: sumKobo(own.filter((i) => i.status === 'sent' || i.status === 'overdue').map((i) => i.total)),
    lastInvoiceDate: own.map((i) => i.issueDate).sort().at(-1),
  }
}

export async function listClients(q?: string): Promise<ClientSummary[]> {
  const today = await requestToday(600)
  const all = views(today)
  const term = q?.trim().toLowerCase()
  return clients
    .filter((c) => !term || [c.name, c.contactName, c.city, c.industry].some((v) => v.toLowerCase().includes(term)))
    .map((c) => summarise(c, all))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export async function getClient(id: string): Promise<{ client: ClientSummary; invoices: InvoiceView[] } | null> {
  const today = await requestToday(500)
  const client = clientsById.get(id)
  if (!client) return null
  const all = views(today)
  return {
    client: summarise(client, all),
    invoices: all.filter((i) => i.clientId === id).sort((a, b) => b.issueDate.localeCompare(a.issueDate)),
  }
}

/** Just enough for the client <select> on the new-invoice form. */
export async function getClientOptions(): Promise<{ id: string; name: string }[]> {
  await requestToday(200)
  return clients.map(({ id, name }) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name))
}

export async function getReports() {
  const today = await requestToday(900)
  const all = views(today)
  const months = monthlyRevenue(all, today)
  const paid = all.filter((i) => i.paidDate)

  const statusBreakdown = (['paid', 'sent', 'overdue', 'draft'] as InvoiceStatus[]).map((status) => {
    const list = all.filter((i) => i.status === status)
    return { status, count: list.length, amount: sumKobo(list.map((i) => i.total)) }
  })

  const topClients = clients
    .map((c) => summarise(c, all))
    .sort((a, b) => b.billed - a.billed)
    .slice(0, 5)

  return {
    today,
    months,
    statusBreakdown,
    topClients,
    totalCollected: sumKobo(months.map((m) => m.collected)),
    totalInvoiced: sumKobo(months.map((m) => m.invoiced)),
    vatCharged: sumKobo(all.filter((i) => i.status !== 'draft' && i.issueDate > addDays(today, -365)).map((i) => i.vat)),
    avgDaysToPay: paid.length
      ? Math.round(paid.reduce((n, i) => n + daysBetween(i.issueDate, i.paidDate!), 0) / paid.length)
      : 0,
  }
}

// ---------------------------------------------------------------------------
// Writes
// ---------------------------------------------------------------------------

export type NewInvoiceInput = {
  clientId: string
  issueDate: ISODate
  dueDate: ISODate
  status: 'draft' | 'sent'
  applyVat: boolean
  notes?: string
  items: Omit<LineItem, 'id'>[]
}

/** Saves to the in-memory store and returns the new invoice's number. */
export async function createInvoice(input: NewInvoiceInput): Promise<string> {
  const today = await requestToday(300)
  if (!clientsById.has(input.clientId)) throw new Error('Unknown client')
  const next = Math.max(...allInvoices(today).map((i) => Number(i.id.slice(4)))) + 1
  const id = `INV-${String(next).padStart(4, '0')}`
  createdInvoices.push({
    id,
    clientId: input.clientId,
    issueDate: input.issueDate,
    dueDate: input.dueDate,
    status: input.status,
    sentDate: input.status === 'sent' ? input.issueDate : undefined,
    applyVat: input.applyVat,
    notes: input.notes,
    items: input.items.map((item, n) => ({ ...item, id: `li_${id}_${n + 1}` })),
  })
  return id
}

// ---------------------------------------------------------------------------
// Marketing content (cached at build time)
// ---------------------------------------------------------------------------
// 'use cache' marks the result as safe to reuse across requests, so the
// marketing pages are prerendered into static HTML at build time. These
// read nothing request-specific.

export async function getPlans() {
  'use cache'
  return plans
}

export async function getComparison() {
  'use cache'
  return comparison
}

export async function getFaqs() {
  'use cache'
  return faqs
}

export async function getTestimonials() {
  'use cache'
  return testimonials
}

export async function getFeatures() {
  'use cache'
  return features
}

export async function getChangelog() {
  'use cache'
  return changelog
}

export async function getLogoWordmarks() {
  'use cache'
  return logoWordmarks
}

/**
 * The landing page's product screenshot is built from the REAL dashboard
 * components fed with this sample snapshot. Cached for a day: it only needs
 * to look right, not be live.
 */
export async function getShowcase() {
  'use cache'
  cacheLife('days')
  // Seed data only: the in-memory store is per-request state and must not
  // leak into a cached (shared) result.
  const today = todayInLagos()
  const all = seed(today).map((inv) => toView(inv, today))
  const months = monthlyRevenue(all, today)
  const recent = [...all]
    .filter((i) => i.status !== 'draft')
    .sort((a, b) => b.issueDate.localeCompare(a.issueDate))
    .slice(0, 4)
  const outstanding = sumKobo(all.filter((i) => i.status === 'sent' || i.status === 'overdue').map((i) => i.total))
  const overdue = sumKobo(all.filter((i) => i.status === 'overdue').map((i) => i.total))
  return {
    months,
    recent,
    outstanding,
    overdue,
    collected: months.at(-2)?.collected ?? 0,
    previousCollected: months.at(-3)?.collected ?? 0,
  }
}
