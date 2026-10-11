'use server'
// SERVER ACTION for the new-invoice form. The browser sends the FormData;
// everything is checked again HERE, because anything sent from a browser
// can be edited before it arrives. The client form's live total is a
// convenience, not a source of truth.

import { redirect } from 'next/navigation'
import { createInvoice, getClientOptions } from '@/lib/data'
import { nairaToKobo } from '@/lib/money'

export type LineErrors = { description?: string; quantity?: string; unitPrice?: string }

export type NewInvoiceState = {
  errors?: {
    clientId?: string
    issueDate?: string
    dueDate?: string
    items?: string
    lines?: Record<number, LineErrors>
  }
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const MONEY = /^\d{1,9}(\.\d{1,2})?$/ // up to ₦999,999,999.99

export async function createInvoiceAction(_prev: NewInvoiceState, form: FormData): Promise<NewInvoiceState> {
  const clientId = String(form.get('clientId') ?? '')
  const issueDate = String(form.get('issueDate') ?? '')
  const dueDate = String(form.get('dueDate') ?? '')
  const status = form.get('status') === 'sent' ? 'sent' : 'draft'
  const applyVat = form.get('applyVat') === 'on'
  const notes = String(form.get('notes') ?? '').trim().slice(0, 500) || undefined

  // Line items arrive as parallel lists: the nth description goes with the
  // nth quantity and the nth price.
  const descriptions = form.getAll('description').map(String)
  const quantities = form.getAll('quantity').map(String)
  const prices = form.getAll('unitPrice').map((v) => String(v).replace(/[₦,\s]/g, ''))

  const errors: NonNullable<NewInvoiceState['errors']> = {}
  const clients = await getClientOptions()
  if (!clients.some((c) => c.id === clientId)) errors.clientId = 'Choose who this invoice is for.'
  if (!ISO_DATE.test(issueDate)) errors.issueDate = 'Enter the date you’re issuing this invoice.'
  if (!ISO_DATE.test(dueDate)) errors.dueDate = 'Enter a due date.'
  else if (ISO_DATE.test(issueDate) && dueDate < issueDate) errors.dueDate = 'The due date can’t be before the issue date.'

  const lines: Record<number, LineErrors> = {}
  const items = descriptions.map((description, i) => {
    const line: LineErrors = {}
    const quantity = Number(quantities[i])
    if (!description.trim()) line.description = 'Describe the work.'
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 9999) line.quantity = 'Use a whole number from 1 to 9,999.'
    if (!MONEY.test(prices[i] ?? '') || Number(prices[i]) <= 0) line.unitPrice = 'Enter a price in naira, like 45000.'
    if (Object.keys(line).length) lines[i] = line
    return { description: description.trim().slice(0, 200), quantity, unitPrice: nairaToKobo(Number(prices[i])) }
  })
  if (items.length === 0) errors.items = 'Add at least one line item.'
  if (Object.keys(lines).length) errors.lines = lines

  if (Object.keys(errors).length) return { errors }

  const id = await createInvoice({ clientId, issueDate, dueDate, status, applyVat, notes, items })
  // ?created=1 makes the invoice page show a "created" toast.
  redirect(`/invoices/${id}?created=1`)
}
