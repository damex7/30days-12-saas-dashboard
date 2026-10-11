// SAMPLE CONTENT: 80 invoices over the last 12 months.
//
// They are GENERATED rather than typed out, but deterministically: a seeded
// random number generator produces the same 80 invoices on every run, so
// the demo never changes under you. Dates are laid out relative to "today"
// (passed in), so the dashboard always shows a believable recent history
// instead of going stale a month after this was written.

import { addDays } from '@/lib/dates'
import type { ISODate, Invoice, LineItem } from '@/lib/types'
import { clients } from './clients'

/** Mulberry32: a tiny, well-known seeded PRNG. Same seed → same sequence. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** What a design studio bills for, with typical prices in kobo. */
const services: { description: string; unitPrice: number; qty: [number, number] }[] = [
  { description: 'Brand identity design', unitPrice: 45_000_000, qty: [1, 1] },
  { description: 'Logo design (3 concepts)', unitPrice: 18_000_000, qty: [1, 1] },
  { description: 'Website design, 5 pages', unitPrice: 85_000_000, qty: [1, 1] },
  { description: 'Social media graphics (monthly)', unitPrice: 12_000_000, qty: [1, 3] },
  { description: 'Product photography, half day', unitPrice: 15_000_000, qty: [1, 2] },
  { description: 'Packaging design', unitPrice: 30_000_000, qty: [1, 1] },
  { description: 'Pitch deck design', unitPrice: 25_000_000, qty: [1, 1] },
  { description: 'UX audit and report', unitPrice: 20_000_000, qty: [1, 1] },
  { description: 'Copywriting (per page)', unitPrice: 3_500_000, qty: [3, 8] },
  { description: 'Print collateral (flyers, cards)', unitPrice: 9_000_000, qty: [1, 2] },
  { description: 'Consultation (per hour)', unitPrice: 2_500_000, qty: [2, 6] },
  { description: 'Event branding package', unitPrice: 38_000_000, qty: [1, 1] },
  { description: 'Motion graphics, 30 seconds', unitPrice: 22_000_000, qty: [1, 2] },
  { description: 'Website care plan (monthly)', unitPrice: 6_000_000, qty: [1, 3] },
]

const notes = [
  'Thank you for your business!',
  'Payment by bank transfer, please use the invoice number as the reference.',
  undefined,
  'Second instalment of the agreed project fee.',
  undefined,
]

export const SEED_INVOICE_COUNT = 80

export function seedInvoices(today: ISODate): Invoice[] {
  const rand = mulberry32(12) // Day 12
  const pick = <T,>(list: T[]) => list[Math.floor(rand() * list.length)]
  const between = (min: number, max: number) => min + Math.floor(rand() * (max - min + 1))

  const invoices: Invoice[] = []
  for (let i = 0; i < SEED_INVOICE_COUNT; i++) {
    // Spread issue dates over ~360 days, oldest first, with a little jitter.
    const daysAgo = Math.max(0, Math.round(360 - (i * 360) / (SEED_INVOICE_COUNT - 1)) - between(0, 3))
    const issueDate = addDays(today, -daysAgo)
    const terms = pick([7, 14, 14, 30])
    const dueDate = addDays(issueDate, terms)

    const itemCount = between(1, 3)
    const chosen = new Set<number>()
    while (chosen.size < itemCount) chosen.add(Math.floor(rand() * services.length))
    const items: LineItem[] = [...chosen].map((s, n) => ({
      id: `li_${i + 1}_${n + 1}`,
      description: services[s].description,
      quantity: between(...services[s].qty),
      unitPrice: services[s].unitPrice,
    }))

    // Status: almost every old invoice got paid (some late); a few recent
    // ones are still outstanding; the newest few are drafts.
    let status: Invoice['status'] = 'sent'
    let paidDate: ISODate | undefined
    const r = rand()
    if (daysAgo <= 4 && r < 0.5) {
      status = 'draft'
    } else if (dueDate < today ? r < (daysAgo > 150 ? 0.97 : 0.82) : r < 0.3) {
      status = 'paid'
      // Paid between issue and up to 3 weeks late, but never in the future.
      const paidAfter = between(1, terms + (rand() < 0.3 ? 21 : 0))
      paidDate = addDays(issueDate, paidAfter) > today ? today : addDays(issueDate, paidAfter)
    }

    invoices.push({
      id: `INV-${String(i + 1).padStart(4, '0')}`,
      clientId: clients[(i * 7 + between(0, 4)) % clients.length].id,
      issueDate,
      dueDate,
      status,
      paidDate,
      sentDate: status === 'draft' ? undefined : issueDate,
      items,
      applyVat: rand() < 0.8,
      notes: pick(notes),
    })
  }
  return invoices
}
