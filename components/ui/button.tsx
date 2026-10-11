import { cva, type VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * Button: the one way to make something clickable look clickable.
 *
 * Design:
 * - VARIANTS WITH cva: `variant` and `size` are typed unions, so
 *   <Button variant="primery"> is a TypeScript error, and all the class
 *   combinations live in one table instead of scattered ternaries.
 * - CAN RENDER AS A LINK: pass `href` and you get a Next.js <Link> styled
 *   as a button. Navigation must be a link (it opens in a new tab and shows
 *   the URL), and actions must be a <button>; one component covers both
 *   without anyone faking a link with onClick.
 * - LOADING: `loading` shows a spinner, sets aria-busy and disables the
 *   button, but keeps the label, so the width doesn't jump and screen
 *   readers still know what the button is.
 * - SERVER COMPONENT: no state or effects, so it works everywhere. Form
 *   pending state lives in <SubmitButton> (a small client wrapper).
 */
export const buttonVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center gap-2 rounded-control font-semibold whitespace-nowrap',
    'transition-[background-color,color,box-shadow] duration-150 select-none',
    'disabled:cursor-not-allowed disabled:opacity-55 aria-disabled:pointer-events-none aria-disabled:opacity-55',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-brand text-brand-ink shadow-card hover:bg-brand-hover',
        secondary: 'border border-line-strong bg-raised text-ink hover:border-brand hover:bg-brand-soft',
        ghost: 'text-ink hover:bg-sunken',
        danger: 'bg-danger text-danger-ink shadow-card hover:bg-danger-hover',
      },
      size: {
        sm: 'h-8 px-3 text-sm [&_svg]:size-4',
        md: 'h-10 px-4 text-sm [&_svg]:size-4',
        lg: 'h-12 px-6 text-base [&_svg]:size-5',
        icon: 'size-10 [&_svg]:size-5',
      },
      block: { true: 'w-full' },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

type Variants = VariantProps<typeof buttonVariants>

type ButtonOwnProps = Variants & {
  loading?: boolean
  className?: string
  children?: ReactNode
}

// A discriminated union: with `href` it's a link and takes link props; without, a button.
type AsButton = ButtonOwnProps & Omit<ComponentProps<'button'>, keyof ButtonOwnProps> & { href?: undefined }
type AsLink = ButtonOwnProps & Omit<ComponentProps<typeof Link>, keyof ButtonOwnProps> & { href: string }

export type ButtonProps = AsButton | AsLink

export function Button(props: ButtonProps) {
  if (props.href !== undefined) {
    const { variant, size, block, loading, className, children, ...rest } = props
    return (
      <Link
        {...rest}
        className={cn(buttonVariants({ variant, size, block }), className)}
        aria-disabled={loading || undefined}
      >
        {loading && <Spinner />}
        {children}
      </Link>
    )
  }

  const { variant, size, block, loading, className, children, type = 'button', disabled, ...rest } = props
  return (
    <button
      {...rest}
      // Default to type="button": a plain <button> inside a form would submit it.
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ variant, size, block }), className)}
    >
      {loading && <Spinner />}
      {children}
    </button>
  )
}

/** A small spinning ring. Decorative: the button's aria-busy carries the meaning. */
export function Spinner({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className={cn('size-4 animate-spin', className)}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
