import { FileSearch } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { InvoiceStatusBadge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { SortableHeader, Table, TableEmpty, TBody, TD, TH, THead, TR } from '@/components/ui/table'
import { formatDate, formatShortDate } from '@/lib/dates'
import { formatNaira } from '@/lib/money'
import type { InvoiceView, SortDir, SortKey } from '@/lib/types'

/**
 * InvoiceTable: the invoice DataTable, composed from the Table primitives.
 *
 * - Sorting: when `hrefForSort` is given, headers become <SortableHeader>
 *   links; the client list uses it, the client detail page doesn't.
 * - Whole-row click: the invoice number is the row's real link, and a CSS
 *   "stretched link" (an ::after covering the row) makes the whole row
 *   clickable without nesting links or adding onClick to a <tr>. Inside
 *   the /invoices list, Next.js intercepts that link and opens the
 *   quick-view modal (see app/(app)/invoices/@modal).
 * - `empty` is a slot: the caller decides what "no results" says and offers.
 * - Columns that matter least (issued/due dates) hide on phones; the due
 *   date moves under the client name instead.
 */
export function InvoiceTable({
  invoices,
  caption = 'Invoices',
  sort,
  dir,
  hrefForSort,
  empty,
  showClient = true,
}: {
  invoices: InvoiceView[]
  caption?: string
  sort?: SortKey
  dir?: SortDir
  hrefForSort?: (sort: string, dir: SortDir) => string
  empty?: ReactNode
  showClient?: boolean
}) {
  const header = (key: SortKey, label: string, opts: { align?: 'right'; className?: string } = {}) =>
    hrefForSort ? (
      <SortableHeader label={label} sortKey={key} currentSort={sort} currentDir={dir} hrefFor={hrefForSort} {...opts} />
    ) : (
      <TH align={opts.align} className={opts.className}>
        {label}
      </TH>
    )
  const columns = showClient ? 6 : 5

  return (
    <Table caption={caption} captionHidden>
      <THead>
        <TR>
          {header('number', 'Invoice')}
          {showClient && header('client', 'Client')}
          {header('issueDate', 'Issued', { className: 'max-md:hidden' })}
          {header('dueDate', 'Due', { className: 'max-sm:hidden' })}
          {header('total', 'Amount', { align: 'right' })}
          {header('status', 'Status')}
        </TR>
      </THead>
      <TBody>
        {invoices.length === 0 ? (
          <TableEmpty colSpan={columns}>
            {empty ?? <EmptyState icon={<FileSearch />} title="No invoices" />}
          </TableEmpty>
        ) : (
          invoices.map((inv) => (
            <TR key={inv.id} className="relative hover:bg-sunken/70 has-focus-visible:bg-sunken/70">
              <TD>
                <Link
                  href={`/invoices/${inv.id}`}
                  className="font-mono text-xs font-semibold text-brand after:absolute after:inset-0 hover:underline focus-visible:outline-offset-0"
                >
                  {inv.id}
                </Link>
              </TD>
              {showClient && (
                <TD>
                  <div className="flex items-center gap-3">
                    <Avatar name={inv.client.name} size="sm" decorative className="max-sm:hidden" />
                    <div className="min-w-0">
                      <p className="max-w-56 truncate font-medium text-ink">{inv.client.name}</p>
                      <p className="text-xs text-muted sm:hidden">Due {formatShortDate(inv.dueDate)}</p>
                    </div>
                  </div>
                </TD>
              )}
              <TD className="whitespace-nowrap text-muted max-md:hidden">{formatDate(inv.issueDate)}</TD>
              <TD className="whitespace-nowrap text-muted max-sm:hidden">
                {formatDate(inv.dueDate)}
                {inv.status === 'overdue' && <span className="block text-xs font-medium text-overdue">{inv.daysOverdue} days late</span>}
              </TD>
              <TD align="right" className="font-semibold whitespace-nowrap text-ink">
                {formatNaira(inv.total)}
              </TD>
              <TD>
                <InvoiceStatusBadge status={inv.status} />
              </TD>
            </TR>
          ))
        )}
      </TBody>
    </Table>
  )
}
