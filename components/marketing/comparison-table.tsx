import { Check, Minus } from 'lucide-react'
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table'
import type { ComparisonRow, Plan } from '@/lib/types'

/**
 * The plan comparison: a real table built from the Table primitives, with
 * row headers (<th scope="row">) so a screen reader announces
 * "Automatic reminders, Growth, included" for each cell.
 * Ticks and dashes carry text too ("Included" / "Not included").
 */
export function ComparisonTable({ plans, rows }: { plans: Plan[]; rows: ComparisonRow[] }) {
  return (
    <div className="rounded-card border border-line bg-raised shadow-card">
      <Table caption="Compare plans" captionHidden>
        <THead>
          <TR>
            <TH className="w-2/5">Feature</TH>
            {plans.map((p) => (
              <TH key={p.id} className="text-center">
                {p.name}
              </TH>
            ))}
          </TR>
        </THead>
        <TBody>
          {rows.map((row) => (
            <TR key={row.feature} className="hover:bg-sunken/60">
              <th scope="row" className="px-4 py-3 font-medium text-ink">
                {row.feature}
              </th>
              {plans.map((p) => {
                const v = row.values[p.id]
                return (
                  <TD key={p.id} className="text-center">
                    {v === true ? (
                      <Check aria-label="Included" className="mx-auto size-5 text-brand" />
                    ) : v === false ? (
                      <Minus aria-label="Not included" className="mx-auto size-5 text-subtle" />
                    ) : (
                      <span className="font-medium text-ink">{v}</span>
                    )}
                  </TD>
                )
              })}
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  )
}
