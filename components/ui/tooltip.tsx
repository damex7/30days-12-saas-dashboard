// CLIENT COMPONENT: showing and hiding on hover/focus is browser state.
'use client'

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * Tooltip: a short text label that appears on hover AND keyboard focus.
 *
 *   <Tooltip content="Invoices" side="right">
 *     {(describedBy) => <Link href="/invoices" {...describedBy}>…</Link>}
 *   </Tooltip>
 *
 * Design:
 * - RENDER PROP: the tooltip's id has to go on the focusable element as
 *   aria-describedby, so the child receives those props to spread. (Same
 *   reason, and same pattern, as <Field>.)
 * - Meets WCAG "content on hover or focus": it can be dismissed with Esc
 *   without moving the pointer, stays while the pointer is over it, and
 *   doesn't vanish on a timer.
 * - Tooltips are a hint only; never put essential information or links in one.
 * - `className` styles the bubble. The sidebar uses it to only show
 *   tooltips while collapsed (`hidden sidebar-collapsed:block`), so CSS, not
 *   JavaScript, decides when they apply.
 */
export function Tooltip({
  content,
  side = 'top',
  className,
  wrapperClassName,
  children,
}: {
  content: ReactNode
  side?: 'top' | 'right' | 'bottom'
  /** Styles the bubble. */
  className?: string
  /** Styles the wrapper around the trigger (e.g. `flex w-full` for a full-width link). */
  wrapperClassName?: string
  children: (props: { 'aria-describedby': string }) => ReactNode
}) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const show = (delay: number) => {
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setOpen(true), delay)
  }
  const hide = () => {
    window.clearTimeout(timer.current)
    setOpen(false)
  }

  return (
    <span
      className={cn('relative inline-flex', wrapperClassName)}
      onPointerEnter={() => show(200)}
      onPointerLeave={hide}
      onFocus={() => show(0)}
      onBlur={hide}
    >
      {children({ 'aria-describedby': id })}
      <span
        id={id}
        role="tooltip"
        className={cn(
          'pointer-events-none absolute z-50 w-max max-w-56 rounded-control bg-ink px-2.5 py-1.5 text-xs font-medium text-surface shadow-raised',
          side === 'top' && 'bottom-full left-1/2 mb-2 -translate-x-1/2',
          side === 'bottom' && 'top-full left-1/2 mt-2 -translate-x-1/2',
          side === 'right' && 'top-1/2 left-full ml-3 -translate-y-1/2',
          open ? 'animate-fade-in' : 'invisible',
          className,
        )}
      >
        {content}
      </span>
    </span>
  )
}
