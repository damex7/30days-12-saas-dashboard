// SAMPLE CONTENT: the activity feed, derived from the invoices so the two
// always tell the same story (an invoice marked paid has a "paid" event on
// its paid date, an overdue one has reminders, and so on).

import { addDays } from '@/lib/dates'
import type { ActivityItem, ISODate, InvoiceView } from '@/lib/types'

export function seedActivity(invoices: InvoiceView[], today: ISODate): ActivityItem[] {
  const events: ActivityItem[] = []
  for (const inv of invoices) {
    const base = { invoiceId: inv.id, clientName: inv.client.name, amount: inv.total }
    // Drafts get a "created" event; for sent invoices, "sent" says it all.
    if (inv.status === 'draft') events.push({ ...base, id: `${inv.id}-created`, type: 'created', date: inv.issueDate })
    if (inv.sentDate) {
      events.push({ ...base, id: `${inv.id}-sent`, type: 'sent', date: inv.sentDate })
      const viewed = addDays(inv.sentDate, 1)
      if (viewed <= today) events.push({ ...base, id: `${inv.id}-viewed`, type: 'viewed', date: viewed })
    }
    if (inv.status === 'paid' && inv.paidDate) {
      events.push({ ...base, id: `${inv.id}-paid`, type: 'paid', date: inv.paidDate })
    }
    // Automatic reminders go out 3 and 10 days after the due date.
    if (inv.status === 'overdue') {
      for (const after of [3, 10]) {
        const when = addDays(inv.dueDate, after)
        if (when <= today) events.push({ ...base, id: `${inv.id}-reminder-${after}`, type: 'reminder', date: when })
      }
    }
  }
  // Newest first; for events on the same day, the order of the stages.
  const stage = { paid: 0, reminder: 1, viewed: 2, sent: 3, created: 4 }
  return events.sort((a, b) => b.date.localeCompare(a.date) || stage[a.type] - stage[b.type])
}
