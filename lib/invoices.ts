// PURE invoice maths, with no data access and no React. Imported by the
// server (lib/data.ts) AND by the browser (the live total on /invoices/new),
// so the number a user sees while typing is computed by the exact same code
// as the saved invoice.

import { applyBps, sumKobo, VAT_BPS } from '@/lib/money'
import { daysBetween } from '@/lib/dates'
import type { ISODate, Invoice, InvoiceStatus, Kobo, LineItem, Totals } from '@/lib/types'

export const lineTotal = (item: Pick<LineItem, 'quantity' | 'unitPrice'>): Kobo => item.quantity * item.unitPrice

/**
 * Totals are CALCULATED, never stored. Storing a total next to the line items
 * invites the two to disagree after an edit; deriving it can't.
 * VAT is applied once to the subtotal (not per line) and rounded once.
 */
export function invoiceTotals(items: Pick<LineItem, 'quantity' | 'unitPrice'>[], applyVat: boolean): Totals {
  const subtotal = sumKobo(items.map(lineTotal))
  const vat = applyVat ? applyBps(subtotal, VAT_BPS) : 0
  return { subtotal, vat, total: subtotal + vat }
}

/**
 * "Overdue" is DERIVED: a sent invoice whose due date has passed. Storing it
 * would need a nightly job to flip statuses; deriving it is always correct.
 */
export function effectiveStatus(invoice: Pick<Invoice, 'status' | 'dueDate'>, today: ISODate): InvoiceStatus {
  if (invoice.status === 'sent' && invoice.dueDate < today) return 'overdue'
  return invoice.status
}

export const statusLabel: Record<InvoiceStatus, string> = {
  draft: 'Draft',
  sent: 'Sent',
  paid: 'Paid',
  overdue: 'Overdue',
}

export function daysOverdue(invoice: Pick<Invoice, 'dueDate'>, today: ISODate): number {
  return Math.max(0, daysBetween(invoice.dueDate, today))
}
