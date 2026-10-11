// CLIENT COMPONENT: toasts are state that changes over time (added, paused,
// dismissed) and timers, which only exist in the browser.
'use client'

import { CheckCircle2, CircleAlert, Info, X } from 'lucide-react'
import { createContext, use, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * Toast: short, non-blocking feedback ("Invoice saved").
 *
 * Design:
 * - ONE provider in the root layout owns the list, so any Client Component
 *   anywhere can call `useToast().toast(...)` without prop drilling.
 * - The live region (<ol aria-live="polite">) is rendered ALWAYS, even when
 *   empty. Screen readers only announce changes to a live region that already
 *   existed, so mounting it together with the first toast would be silent.
 * - Toasts pause while hovered or focused, so nobody loses a message they are
 *   in the middle of reading, and each has a real close button.
 */

type Tone = 'success' | 'info' | 'error'

export type ToastOptions = {
  title: string
  description?: string
  tone?: Tone
}

type ToastItem = ToastOptions & { id: number }

const ToastContext = createContext<{ toast: (options: ToastOptions) => void } | null>(null)

export function useToast() {
  const ctx = use(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}

const icons = { success: CheckCircle2, info: Info, error: CircleAlert }
const iconColour = { success: 'text-paid', info: 'text-brand', error: 'text-danger' }

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const nextId = useRef(1)

  const toast = useCallback((options: ToastOptions) => {
    const id = nextId.current++
    // Keep at most three on screen; the oldest goes first.
    setToasts((list) => [...list.slice(-2), { tone: 'success', ...options, id }])
  }, [])

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext value={{ toast }}>
      {children}
      {/* The toast region: a landmark-free list that sits above everything. */}
      <ol
        aria-live="polite"
        aria-label="Notifications"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 p-4 sm:items-end print:hidden"
      >
        {toasts.map((t) => (
          <ToastCard key={t.id} item={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </ol>
    </ToastContext>
  )
}

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const [paused, setPaused] = useState(false)
  const Icon = icons[item.tone ?? 'success']

  useEffect(() => {
    if (paused) return
    const timer = window.setTimeout(onDismiss, 5000)
    return () => window.clearTimeout(timer)
  }, [paused, onDismiss])

  return (
    <li
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="pointer-events-auto flex w-full max-w-sm animate-rise items-start gap-3 rounded-card border border-line bg-raised p-4 shadow-pop"
    >
      <Icon aria-hidden className={cn('mt-0.5 size-5 shrink-0', iconColour[item.tone ?? 'success'])} />
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-ink">{item.title}</p>
        {item.description && <p className="mt-0.5 text-sm text-muted">{item.description}</p>}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="-m-1 grid size-7 shrink-0 place-items-center rounded-control text-muted hover:bg-sunken hover:text-ink"
      >
        <X aria-hidden className="size-4" />
        <span className="sr-only">Dismiss notification</span>
      </button>
    </li>
  )
}

/**
 * Shows a toast once when it mounts. Lets a Server Component trigger a toast
 * after a redirect, e.g. /invoices/INV-0081?created=1 renders
 * <ToastOnMount title="Invoice created" />.
 */
export function ToastOnMount(props: ToastOptions) {
  const { toast } = useToast()
  const shown = useRef(false)
  useEffect(() => {
    // React's development Strict Mode runs effects twice; the ref keeps it to one toast.
    if (shown.current) return
    shown.current = true
    toast(props)
  }, [toast, props])
  return null
}
