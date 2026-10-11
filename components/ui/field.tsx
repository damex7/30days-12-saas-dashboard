import type { ReactNode } from 'react'
import { CircleAlert } from 'lucide-react'
import { cn } from '@/lib/cn'

/** The props Field hands to its control so the wiring is never forgotten. */
export type FieldControlProps = {
  id: string
  name: string
  'aria-describedby'?: string
  'aria-invalid'?: true
  required?: boolean
}

type FieldProps = {
  /** Used for the control's id and name, and to build the hint/error ids. */
  name: string
  label: ReactNode
  hint?: ReactNode
  error?: string
  required?: boolean
  /** Visually hide the label (it's still read out), e.g. a search box with an icon. */
  hideLabel?: boolean
  className?: string
  children: (control: FieldControlProps) => ReactNode
}

/**
 * Field: label + control + hint + error, wired together for screen readers.
 *
 *   <Field name="email" label="Email" hint="We'll send the receipt here" error={errors.email}>
 *     {(control) => <Input type="email" {...control} />}
 *   </Field>
 *
 * Design:
 * - RENDER PROP: Field works out the ids and passes `id`, `aria-describedby`
 *   and `aria-invalid` to whatever control you render: Input, Select,
 *   Textarea, or something custom. That's what "label + hint + error wiring"
 *   means: when the error appears, a screen reader reads it with the field.
 * - Why not React context? Context needs a Client Component. A render prop
 *   is just a function call, so Field works in Server Components too.
 * - The error has an icon and text, never just a red border, and is
 *   announced because it is part of the field's description.
 */
export function Field({ name, label, hint, error, required, hideLabel, className, children }: FieldProps) {
  const hintId = hint ? `${name}-hint` : undefined
  const errorId = error ? `${name}-error` : undefined
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={name} className={cn('text-sm font-semibold text-ink', hideLabel && 'sr-only')}>
        {label}
        {required && (
          <span aria-hidden className="ml-0.5 text-danger">
            *
          </span>
        )}
      </label>
      {children({ id: name, name, 'aria-describedby': describedBy, 'aria-invalid': error ? true : undefined, required })}
      {hint && !error && (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="flex items-center gap-1.5 text-xs font-medium text-danger">
          <CircleAlert aria-hidden className="size-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}
