// Domain types shared by /data, lib/data.ts and the UI.
// On Day 16 these become the shape of the database rows.

/** A whole number of kobo (₦1 = 100 kobo). See lib/money.ts. */
export type Kobo = number

/** A calendar date as 'YYYY-MM-DD'. Invoices are dated by day, not by instant. */
export type ISODate = string

/** What is stored. "overdue" is never stored: it is worked out from the due date. */
export type StoredStatus = 'draft' | 'sent' | 'paid'
export type InvoiceStatus = StoredStatus | 'overdue'

export const INVOICE_STATUSES: InvoiceStatus[] = ['draft', 'sent', 'paid', 'overdue']

export type Business = {
  name: string
  ownerName: string
  ownerRole: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  tin: string
  bank: { name: string; accountName: string; accountNumber: string }
  plan: 'free' | 'growth' | 'business'
  paymentTermsDays: number
}

export type Client = {
  id: string
  name: string
  contactName: string
  email: string
  phone: string
  city: string
  state: string
  industry: string
  since: ISODate
}

export type LineItem = {
  id: string
  description: string
  quantity: number
  unitPrice: Kobo
}

/** An invoice as stored. Note: no totals. They are always calculated. */
export type Invoice = {
  id: string // also the invoice number, e.g. "INV-0042"
  clientId: string
  issueDate: ISODate
  dueDate: ISODate
  status: StoredStatus
  paidDate?: ISODate
  sentDate?: ISODate
  items: LineItem[]
  applyVat: boolean
  notes?: string
}

export type Totals = { subtotal: Kobo; vat: Kobo; total: Kobo }

/** An invoice ready for display: client attached, totals and status worked out. */
export type InvoiceView = Omit<Invoice, 'status'> &
  Totals & {
    status: InvoiceStatus
    client: Client
    daysOverdue: number
  }

export type ActivityType = 'created' | 'sent' | 'viewed' | 'paid' | 'reminder'

export type ActivityItem = {
  id: string
  type: ActivityType
  date: ISODate
  invoiceId: string
  clientName: string
  amount: Kobo
}

export type Notification = ActivityItem & { unread: boolean }

export type Stat = {
  label: string
  value: Kobo | number
  format: 'money' | 'percent'
  /** Same measure a month ago, for the "vs last month" line. */
  previous: Kobo | number
  /** Whether a rise is good news (revenue) or bad news (overdue). */
  higherIsBetter: boolean
  hint: string
}

export type MonthRevenue = { month: string; label: string; invoiced: Kobo; collected: Kobo }

export type SortKey = 'number' | 'client' | 'issueDate' | 'dueDate' | 'total' | 'status'
export type SortDir = 'asc' | 'desc'

export type InvoiceQuery = {
  status?: InvoiceStatus
  q?: string
  page?: number
  sort?: SortKey
  dir?: SortDir
}

export type InvoicePage = {
  items: InvoiceView[]
  total: number
  page: number
  pageCount: number
  pageSize: number
  counts: Record<InvoiceStatus | 'all', number>
}

export type ClientSummary = Client & {
  invoiceCount: number
  billed: Kobo
  outstanding: Kobo
  lastInvoiceDate?: ISODate
}

// Marketing content -----------------------------------------------------

export type PlanId = 'free' | 'growth' | 'business'

export type Plan = {
  id: PlanId
  name: string
  blurb: string
  monthly: Kobo
  /** Yearly price: 10 × monthly, i.e. two months free. */
  yearly: Kobo
  highlights: string[]
  cta: string
  featured?: boolean
}

export type ComparisonRow = { feature: string; values: Record<PlanId, string | boolean> }

export type Faq = { question: string; answer: string }

export type Testimonial = {
  quote: string
  name: string
  role: string
  business: string
  city: string
  /** Headline result for case-study cards, e.g. "Paid 9 days faster". */
  result?: string
}

export type Feature = { icon: string; title: string; body: string }

export type ChangelogEntry = { version: string; date: ISODate; title: string; items: string[]; tag: 'New' | 'Improved' | 'Fixed' }
