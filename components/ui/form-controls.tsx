import { ChevronDown } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn'

/*
 * FORM CONTROLS: Input, Textarea, Select, Checkbox and Switch.
 *
 * Design:
 * - Each is a thin wrapper around the NATIVE element and passes every
 *   native prop through (`...props`). Native elements bring keyboard
 *   support, mobile keyboards, autofill and form submission for free;
 *   we only add the look.
 * - The invalid style keys off `aria-invalid`, the same attribute screen
 *   readers use, so the visual and the accessible state can't disagree.
 * - Labels, hints and errors are NOT built in to Input/Textarea/Select:
 *   <Field> wraps any of them (see field.tsx). Checkbox and Switch do take a
 *   label, because their label sits beside the control, not above it.
 * - Server Components: all state lives in the DOM or in the parent form.
 */

const controlBase = [
  'w-full rounded-control border border-line-strong bg-raised text-ink',
  'placeholder:text-subtle transition-colors',
  'hover:border-muted focus-visible:border-brand',
  'disabled:cursor-not-allowed disabled:bg-sunken disabled:text-muted',
  'aria-invalid:border-danger aria-invalid:hover:border-danger',
]

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return <input {...props} className={cn(controlBase, 'h-10 px-3 text-sm', className)} />
}

export function Textarea({ className, rows = 4, ...props }: ComponentProps<'textarea'>) {
  return <textarea {...props} rows={rows} className={cn(controlBase, 'min-h-20 px-3 py-2 text-sm leading-relaxed', className)} />
}

/**
 * A native <select> with a custom chevron. Native beats a custom listbox
 * on phones (it opens the OS picker) and is accessible by default.
 */
export function Select({ className, children, ...props }: ComponentProps<'select'>) {
  return (
    <div className="relative">
      <select {...props} className={cn(controlBase, 'h-10 appearance-none pr-9 pl-3 text-sm', className)}>
        {children}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted" />
    </div>
  )
}

type CheckProps = Omit<ComponentProps<'input'>, 'type'> & {
  label: ReactNode
  description?: ReactNode
}

/**
 * Checkbox with its label beside it. The whole <label> is the click target,
 * which is far easier to hit on a phone than a 16px box.
 */
export function Checkbox({ label, description, className, id, ...props }: CheckProps) {
  const descId = description && id ? `${id}-description` : undefined
  return (
    <label htmlFor={id} className={cn('flex cursor-pointer items-start gap-3 text-sm', props.disabled && 'cursor-not-allowed opacity-60', className)}>
      <input
        {...props}
        id={id}
        type="checkbox"
        aria-describedby={descId}
        className="mt-0.5 size-4 shrink-0 cursor-pointer rounded-sm border-line-strong accent-brand"
      />
      <span>
        <span className="font-medium text-ink">{label}</span>
        {description && (
          <span id={descId} className="block text-muted">
            {description}
          </span>
        )}
      </span>
    </label>
  )
}

/**
 * Switch: an on/off setting that applies immediately, like "Dark mode".
 * Under the hood it's a real checkbox with role="switch", so it submits
 * with forms and screen readers announce "on/off" instead of "checked".
 * The track and thumb are drawn with `peer` styles that follow its state.
 */
export function Switch({ label, description, className, id, ...props }: CheckProps) {
  const descId = description && id ? `${id}-description` : undefined
  return (
    <label htmlFor={id} className={cn('flex cursor-pointer items-start justify-between gap-4 text-sm', props.disabled && 'cursor-not-allowed opacity-60', className)}>
      <span>
        <span className="font-medium text-ink">{label}</span>
        {description && (
          <span id={descId} className="block text-muted">
            {description}
          </span>
        )}
      </span>
      <span className="relative inline-flex shrink-0">
        <input {...props} id={id} type="checkbox" role="switch" aria-describedby={descId} className="peer sr-only" />
        <span
          aria-hidden
          className={cn(
            'h-6 w-11 rounded-pill border border-line-strong bg-sunken transition-colors',
            'peer-checked:border-brand peer-checked:bg-brand',
            'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus',
          )}
        />
        <span
          aria-hidden
          className="absolute top-1 left-1 size-4 rounded-pill bg-white shadow-card transition-transform peer-checked:translate-x-5"
        />
      </span>
    </label>
  )
}
