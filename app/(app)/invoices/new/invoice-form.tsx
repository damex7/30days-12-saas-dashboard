// CLIENT COMPONENT: the line items are a list that grows and shrinks as you
// type, and the total updates live, so this form holds state in the browser.
'use client'

import { CircleAlert, Plus, Trash2 } from 'lucide-react'
import { useActionState, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardBody, CardFooter, CardHeader } from '@/components/ui/card'
import { Field } from '@/components/ui/field'
import { Input, Select, Switch, Textarea } from '@/components/ui/form-controls'
import { SubmitButton } from '@/components/ui/submit-button'
import { cn } from '@/lib/cn'
import { addDays } from '@/lib/dates'
import { invoiceTotals } from '@/lib/invoices'
import { formatNaira, nairaToKobo, VAT_LABEL } from '@/lib/money'
import { createInvoiceAction, type NewInvoiceState } from './actions'

type Line = { key: number; description: string; quantity: string; unitPrice: string }

/** Naira typed by a person ("45,000") → kobo, or 0 while it's not a number yet. */
const toKobo = (text: string) => {
  const n = Number(text.replace(/[₦,\s]/g, ''))
  return Number.isFinite(n) && n > 0 ? nairaToKobo(n) : 0
}

/**
 * The new-invoice form.
 *
 * - DYNAMIC LINE ITEMS: an array in state; each row has a stable `key` (not
 *   its index) so React keeps the right input focused when a row above it
 *   is removed. Adding a row moves focus into it; removing one moves focus
 *   to the next sensible place, so keyboard users never get lost.
 * - LIVE TOTAL: computed with invoiceTotals() from lib/invoices.ts, the
 *   same function the server uses, so the number you see is the number
 *   that gets saved.
 * - CONTROLLED INPUTS: React 19 resets uncontrolled fields after a form
 *   action runs; keeping values in state means nothing is lost when the
 *   server sends back errors.
 * - ERRORS: the server's messages appear next to each field (wired by
 *   <Field>) AND in a summary at the top that takes focus and links to
 *   each problem, the pattern GOV.UK recommends for long forms.
 */
export function InvoiceForm({ clients, today }: { clients: { id: string; name: string }[]; today: string }) {
  const [state, formAction] = useActionState<NewInvoiceState, FormData>(createInvoiceAction, {})
  const [clientId, setClientId] = useState('')
  const [issueDate, setIssueDate] = useState(today)
  const [dueDate, setDueDate] = useState(addDays(today, 14))
  const [dueTouched, setDueTouched] = useState(false)
  const [status, setStatus] = useState<'draft' | 'sent'>('sent')
  const [applyVat, setApplyVat] = useState(true)
  const [notes, setNotes] = useState('Thank you for your business!')
  const [lines, setLines] = useState<Line[]>([{ key: 1, description: '', quantity: '1', unitPrice: '' }])
  const nextKey = useRef(2)
  const focusKey = useRef<number | null>(null)
  const summaryRef = useRef<HTMLDivElement>(null)
  const addButtonRef = useRef<HTMLButtonElement>(null)

  // Fields edited since the server last answered: their old error is hidden,
  // so a message disappears as soon as you start fixing it. Keyed to `state`,
  // so a new answer from the server starts with a clean slate.
  const [edited, setEdited] = useState<{ answer: NewInvoiceState; keys: Set<string> }>({ answer: state, keys: new Set() })
  const editedKeys = edited.answer === state ? edited.keys : new Set<string>()
  const markEdited = (key: string) =>
    setEdited((prev) => ({ answer: state, keys: new Set([...(prev.answer === state ? prev.keys : []), key]) }))
  const show = (key: string, message?: string) => (message && !editedKeys.has(key) ? message : undefined)

  const errors = state.errors
  const totals = invoiceTotals(
    lines.map((l) => ({ quantity: Math.max(0, Math.floor(Number(l.quantity)) || 0), unitPrice: toKobo(l.unitPrice) })),
    applyVat,
  )

  // When the server returns errors, move focus to the summary so it's read out.
  useEffect(() => {
    if (errors) summaryRef.current?.focus()
  }, [errors])

  // After adding a row, focus its description field.
  useEffect(() => {
    if (focusKey.current === null) return
    document.getElementById(`description-${focusKey.current}`)?.focus()
    focusKey.current = null
  }, [lines])

  const update = (key: number, patch: Partial<Line>) => setLines((ls) => ls.map((l) => (l.key === key ? { ...l, ...patch } : l)))

  const addLine = () => {
    const key = nextKey.current++
    focusKey.current = key
    setLines((ls) => [...ls, { key, description: '', quantity: '1', unitPrice: '' }])
  }

  const removeLine = (key: number) => {
    const index = lines.findIndex((l) => l.key === key)
    const remaining = lines.filter((l) => l.key !== key)
    setLines(remaining)
    // Focus the row that slid into this place, or the "Add line" button.
    const target = remaining[index] ?? remaining[index - 1]
    if (target) focusKey.current = target.key
    else addButtonRef.current?.focus()
  }

  const summary = errors
    ? [
        errors.clientId && { href: '#clientId', text: errors.clientId },
        errors.issueDate && { href: '#issueDate', text: errors.issueDate },
        errors.dueDate && { href: '#dueDate', text: errors.dueDate },
        errors.items && { href: '#add-line', text: errors.items },
        ...Object.entries(errors.lines ?? {}).flatMap(([i, line]) =>
          Object.entries(line).map(([field, text]) => ({
            href: `#${field}-${lines[Number(i)]?.key}`,
            text: `Line ${Number(i) + 1}: ${text}`,
          })),
        ),
      ].filter((e): e is { href: string; text: string } => Boolean(e))
    : []

  return (
    <form action={formAction} noValidate className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
      <div className="flex min-w-0 flex-col gap-6">
        {summary.length > 0 && (
          <div ref={summaryRef} tabIndex={-1} role="alert" aria-labelledby="error-summary-title" className="rounded-card border-2 border-danger bg-overdue-soft/50 p-5">
            <h2 id="error-summary-title" className="flex items-center gap-2 font-sans text-base font-bold tracking-normal text-ink">
              <CircleAlert aria-hidden className="size-5 text-danger" />
              There {summary.length === 1 ? 'is a problem' : `are ${summary.length} problems`} with this invoice
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-7 text-sm">
              {summary.map((e) => (
                <li key={e.href + e.text}>
                  <a href={e.href} className="font-semibold text-danger underline">
                    {e.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Card>
          <CardHeader title="Details" />
          <CardBody className="grid gap-5 sm:grid-cols-2">
            <Field name="clientId" label="Client" error={show('clientId', errors?.clientId)} className="sm:col-span-2">
              {(control) => (
                <Select {...control} value={clientId} onChange={(e) => {
                    setClientId(e.target.value)
                    markEdited('clientId')
                  }}>
                  <option value="">Choose a client…</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
            <Field name="issueDate" label="Issue date" error={show('issueDate', errors?.issueDate)}>
              {(control) => (
                <Input
                  {...control}
                  type="date"
                  value={issueDate}
                  onChange={(e) => {
                    setIssueDate(e.target.value)
                    markEdited('issueDate')
                    // Keep 14-day terms until the due date is set by hand.
                    if (!dueTouched && e.target.value) setDueDate(addDays(e.target.value, 14))
                  }}
                />
              )}
            </Field>
            <Field name="dueDate" label="Due date" hint="14 days after issue, unless you change it." error={show('dueDate', errors?.dueDate)}>
              {(control) => (
                <Input
                  {...control}
                  type="date"
                  value={dueDate}
                  min={issueDate}
                  onChange={(e) => {
                    setDueTouched(true)
                    markEdited('dueDate')
                    setDueDate(e.target.value)
                  }}
                />
              )}
            </Field>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Line items" description="What you did and what it costs. Prices in naira." />
          <CardBody>
            {/* A list, not a table: each row is a small group of fields
                that reflows into a stack on phones. */}
            <ol className="flex flex-col gap-4">
              {lines.map((line, i) => {
                const le = errors?.lines?.[i]
                const n = i + 1
                return (
                  <li key={line.key} className="grid grid-cols-[1fr_auto] gap-3 rounded-control border border-line p-3 sm:grid-cols-[1fr_5.5rem_9rem_auto] sm:items-start sm:border-0 sm:p-0">
                    <Field name={`description-${line.key}`} label={`Description, line ${n}`} hideLabel={i > 0} error={show(`description-${line.key}`, le?.description)} className="col-span-2 sm:col-span-1">
                      {(control) => (
                        <Input {...control} name="description" value={line.description} placeholder="e.g. Logo design (3 concepts)" onChange={(e) => {
                            update(line.key, { description: e.target.value })
                            markEdited(`description-${line.key}`)
                          }} />
                      )}
                    </Field>
                    <Field name={`quantity-${line.key}`} label="Qty" hideLabel={i > 0} error={show(`quantity-${line.key}`, le?.quantity)}>
                      {(control) => (
                        <Input
                          {...control}
                          aria-label={`Quantity, line ${n}`}
                          name="quantity"
                          type="number"
                          inputMode="numeric"
                          min={1}
                          step={1}
                          value={line.quantity}
                          onChange={(e) => {
                            update(line.key, { quantity: e.target.value })
                            markEdited(`quantity-${line.key}`)
                          }}
                        />
                      )}
                    </Field>
                    <Field name={`unitPrice-${line.key}`} label="Unit price (₦)" hideLabel={i > 0} error={show(`unitPrice-${line.key}`, le?.unitPrice)}>
                      {(control) => (
                        <Input
                          {...control}
                          aria-label={`Unit price in naira, line ${n}`}
                          name="unitPrice"
                          inputMode="decimal"
                          placeholder="45,000"
                          value={line.unitPrice}
                          onChange={(e) => {
                            update(line.key, { unitPrice: e.target.value })
                            markEdited(`unitPrice-${line.key}`)
                          }}
                        />
                      )}
                    </Field>
                    <div className={cn('col-span-2 flex items-center justify-between gap-2 sm:col-span-1 sm:h-10', i === 0 && 'sm:mt-[1.625rem]')}>
                      <span className="text-sm font-semibold text-ink tabular-nums sm:hidden">
                        {formatNaira((Math.floor(Number(line.quantity)) || 0) * toKobo(line.unitPrice))}
                      </span>
                      <Button variant="ghost" size="icon" onClick={() => removeLine(line.key)} disabled={lines.length === 1} className="text-muted hover:text-danger">
                        <Trash2 aria-hidden />
                        <span className="sr-only">Remove line {n}</span>
                      </Button>
                    </div>
                  </li>
                )
              })}
            </ol>
            <Button ref={addButtonRef} id="add-line" variant="secondary" onClick={addLine} className="mt-4" disabled={lines.length >= 20}>
              <Plus aria-hidden /> Add line
            </Button>
            {errors?.items && <p className="mt-2 text-sm font-medium text-danger">{errors.items}</p>}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Notes" description="Shown at the bottom of the invoice." />
          <CardBody>
            <Field name="notes" label="Notes" hideLabel>
              {(control) => <Textarea {...control} rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />}
            </Field>
          </CardBody>
        </Card>
      </div>

      {/* SUMMARY: sticky beside the form on desktop, at the end on phones. */}
      <Card as="section" aria-labelledby="summary-title" className="lg:sticky lg:top-[calc(var(--spacing-topbar)+1.5rem)]">
        <CardHeader title="Summary" id="summary-title" />
        <CardBody className="flex flex-col gap-4">
          <Switch id="applyVat" name="applyVat" label={`Add ${VAT_LABEL}`} description="Charged on the subtotal." checked={applyVat} onChange={(e) => setApplyVat(e.target.checked)} />
          {/* aria-live: screen readers hear the new total after edits. */}
          <dl aria-live="polite" className="space-y-2 border-t border-line pt-4 text-sm tabular-nums">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="text-ink">{formatNaira(totals.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">VAT</dt>
              <dd className="text-ink">{formatNaira(totals.vat)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-2 text-lg font-bold">
              <dt className="text-ink">Total</dt>
              <dd className="text-ink">{formatNaira(totals.total)}</dd>
            </div>
          </dl>
          <fieldset className="border-t border-line pt-4">
            {/* `float-left w-full` stops the legend sitting ON the fieldset's border. */}
            <legend className="float-left mb-2 w-full text-sm font-semibold text-ink">Save as</legend>
            <div className="clear-left flex flex-col gap-2 text-sm">
              {(['sent', 'draft'] as const).map((value) => (
                <label key={value} className="flex items-center gap-2.5">
                  <input type="radio" name="status" value={value} checked={status === value} onChange={() => setStatus(value)} className="size-4 accent-brand" />
                  {value === 'sent' ? 'Sent (ready to share)' : 'Draft (keep editing later)'}
                </label>
              ))}
            </div>
          </fieldset>
        </CardBody>
        <CardFooter className="flex-col items-stretch">
          <SubmitButton block size="lg">
            {status === 'sent' ? 'Create invoice' : 'Save draft'}
          </SubmitButton>
          <p className="text-center text-xs text-muted">Saved for this demo session only.</p>
        </CardFooter>
      </Card>
    </form>
  )
}
