import { InvoiceStatusBadge } from '@/components/ui/badge'
import { LogoMark } from '@/components/layout/logo'
import { cn } from '@/lib/cn'
import { formatDate } from '@/lib/dates'
import { lineTotal } from '@/lib/invoices'
import { formatNaira, VAT_LABEL } from '@/lib/money'
import type { Business, InvoiceView } from '@/lib/types'

/**
 * InvoiceDocument: the invoice as the client sees it, laid out like paper.
 *
 * PRINT: everything around it (sidebar, top bar, page header, buttons) has
 * `print:hidden`, and this component drops its border and shadow with
 * `print:` variants, so Ctrl+P / "Save as PDF" gives a clean A4 invoice.
 * globals.css forces a white page and light colours in print, whatever
 * theme is on screen.
 */
export function InvoiceDocument({ invoice, business, className }: { invoice: InvoiceView; business: Business; className?: string }) {
  return (
    <article
      aria-label={`Invoice ${invoice.id}`}
      className={cn(
        'rounded-card border border-line bg-raised p-6 shadow-card sm:p-10',
        'print:rounded-none print:border-0 print:p-0 print:text-[11pt]',
        className,
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-6 border-b border-line pb-8">
        <div>
          <div className="flex items-center gap-3">
            <LogoMark className="size-10" />
            <div>
              <p className="font-display text-lg font-extrabold text-ink">{business.name}</p>
              <p className="text-sm text-muted">{business.email}</p>
            </div>
          </div>
          <address className="mt-4 text-sm leading-relaxed text-muted not-italic">
            {business.address}
            <br />
            {business.city}, {business.state} State
            <br />
            {business.phone} · TIN {business.tin}
          </address>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-sm font-semibold tracking-wide text-muted uppercase">Invoice</p>
          <p className="font-mono text-2xl font-bold text-ink">{invoice.id}</p>
          <InvoiceStatusBadge status={invoice.status} className="mt-2" />
        </div>
      </header>

      <div className="grid gap-6 py-8 sm:grid-cols-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted uppercase">Bill to</p>
          <p className="mt-1.5 font-semibold text-ink">{invoice.client.name}</p>
          <p className="text-sm text-muted">
            {invoice.client.contactName}
            <br />
            {invoice.client.email}
            <br />
            {invoice.client.city}, {invoice.client.state}
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-4 text-sm sm:col-span-2 sm:grid-cols-3">
          <div>
            <dt className="text-xs font-semibold tracking-wide text-muted uppercase">Issued</dt>
            <dd className="mt-1.5 text-ink">{formatDate(invoice.issueDate)}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold tracking-wide text-muted uppercase">Due</dt>
            <dd className="mt-1.5 text-ink">{formatDate(invoice.dueDate)}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold tracking-wide text-muted uppercase">Amount due</dt>
            <dd className="mt-1.5 font-semibold text-ink">{invoice.status === 'paid' ? formatNaira(0) : formatNaira(invoice.total)}</dd>
          </div>
        </dl>
      </div>

      <table className="w-full text-sm">
        <caption className="sr-only">Line items</caption>
        <thead className="border-y border-line text-xs tracking-wide text-muted uppercase">
          <tr>
            <th scope="col" className="py-2.5 text-left font-semibold">
              Description
            </th>
            <th scope="col" className="py-2.5 text-right font-semibold">
              Qty
            </th>
            <th scope="col" className="py-2.5 text-right font-semibold max-sm:hidden">
              Unit price
            </th>
            <th scope="col" className="py-2.5 text-right font-semibold">
              Amount
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {invoice.items.map((item) => (
            <tr key={item.id}>
              <td className="py-3 pr-4 text-ink">
                {item.description}
                <span className="block text-xs text-muted sm:hidden">{formatNaira(item.unitPrice)} each</span>
              </td>
              <td className="py-3 text-right text-ink tabular-nums">{item.quantity}</td>
              <td className="py-3 text-right text-ink tabular-nums max-sm:hidden">{formatNaira(item.unitPrice)}</td>
              <td className="py-3 text-right font-medium text-ink tabular-nums">{formatNaira(lineTotal(item))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <dl className="mt-4 ml-auto max-w-xs space-y-2 border-t border-line pt-4 text-sm tabular-nums">
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd className="text-ink">{formatNaira(invoice.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">{invoice.applyVat ? VAT_LABEL : 'VAT (not charged)'}</dt>
          <dd className="text-ink">{formatNaira(invoice.vat)}</dd>
        </div>
        <div className="flex justify-between border-t border-line pt-2 text-base font-bold">
          <dt className="text-ink">Total</dt>
          <dd className="text-ink">{formatNaira(invoice.total)}</dd>
        </div>
        {invoice.status === 'paid' && invoice.paidDate && (
          <div className="flex justify-between text-paid">
            <dt>Paid on {formatDate(invoice.paidDate)}</dt>
            <dd>−{formatNaira(invoice.total)}</dd>
          </div>
        )}
      </dl>

      <footer className="mt-10 grid gap-6 border-t border-line pt-6 text-sm sm:grid-cols-2 print:break-inside-avoid">
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted uppercase">Pay by bank transfer</p>
          <p className="mt-1.5 text-ink">
            {business.bank.name}
            <br />
            {business.bank.accountName}
            <br />
            <span className="font-mono">{business.bank.accountNumber}</span>
          </p>
          <p className="mt-1 text-xs text-muted">Please use {invoice.id} as the payment reference.</p>
        </div>
        {invoice.notes && (
          <div>
            <p className="text-xs font-semibold tracking-wide text-muted uppercase">Notes</p>
            <p className="mt-1.5 text-ink">{invoice.notes}</p>
          </div>
        )}
      </footer>
    </article>
  )
}

/** The compact version for the quick-view modal. */
export function InvoiceSummary({ invoice }: { invoice: InvoiceView }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-ink">{invoice.client.name}</p>
          <p className="text-sm text-muted">
            Issued {formatDate(invoice.issueDate)} · due {formatDate(invoice.dueDate)}
          </p>
        </div>
        <InvoiceStatusBadge status={invoice.status} />
      </div>
      <ul className="divide-y divide-line rounded-control border border-line text-sm">
        {invoice.items.map((item) => (
          <li key={item.id} className="flex justify-between gap-4 px-4 py-3">
            <span className="text-ink">
              {item.description}
              <span className="block text-xs text-muted">
                {item.quantity} × {formatNaira(item.unitPrice)}
              </span>
            </span>
            <span className="font-medium text-ink tabular-nums">{formatNaira(lineTotal(item))}</span>
          </li>
        ))}
      </ul>
      <dl className="space-y-1.5 text-sm tabular-nums">
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd className="text-ink">{formatNaira(invoice.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">{invoice.applyVat ? VAT_LABEL : 'VAT (not charged)'}</dt>
          <dd className="text-ink">{formatNaira(invoice.vat)}</dd>
        </div>
        <div className="flex justify-between border-t border-line pt-2 text-base font-bold">
          <dt className="text-ink">Total</dt>
          <dd className="text-ink">{formatNaira(invoice.total)}</dd>
        </div>
      </dl>
    </div>
  )
}
