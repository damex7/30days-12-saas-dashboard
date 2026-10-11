// CLIENT COMPONENT: opening a native <dialog> as a modal needs its
// showModal() method, and that only exists on the DOM element in the browser.
'use client'

import { X } from 'lucide-react'
import { useEffect, useId, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

type DialogProps = {
  open: boolean
  /** Called for every way of closing: Esc, the × button, a backdrop click. */
  onClose: () => void
  title: ReactNode
  description?: ReactNode
  /** Slot for the buttons at the bottom (Cancel / Confirm). */
  footer?: ReactNode
  /** "center" is a classic modal; "left" slides in as a navigation drawer. */
  side?: 'center' | 'left'
  size?: 'sm' | 'md' | 'lg'
  /** Keep the title for screen readers but don't show it (e.g. a drawer with a logo). */
  hideTitle?: boolean
  className?: string
  children: ReactNode
}

/**
 * Dialog, built on the NATIVE <dialog> element.
 *
 * What the browser gives us for free with showModal():
 * - everything outside the dialog becomes inert (no clicking or tabbing
 *   behind it), so there's no hand-written focus trap;
 * - Esc closes it (we hear about it through the `close` event);
 * - it renders in the "top layer", above every z-index, so it can't be
 *   hidden behind a sticky header;
 * - a ::backdrop we style in globals.css.
 *
 * What we add: the open/close sync with React state, closing on a backdrop
 * click, labelling (aria-labelledby/aria-describedby), and putting focus back
 * on the element that opened it, so keyboard users aren't dumped at the top
 * of the page. Page scrolling is locked by one CSS rule in globals.css.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  footer,
  side = 'center',
  size = 'md',
  hideTitle,
  className,
  children,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  const onCloseRef = useRef(onClose)
  const titleId = useId()
  const descId = useId()

  useEffect(() => {
    onCloseRef.current = onClose
  })

  // Keep the DOM dialog in sync with the `open` prop.
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      opener.current = document.activeElement as HTMLElement | null
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  // The native `close` event fires however the dialog closed (Esc included).
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    const handleClose = () => {
      onCloseRef.current()
      // Return focus to whatever opened the dialog, if it's still on the page.
      const el = opener.current
      if (el?.isConnected) el.focus()
    }
    dialog.addEventListener('close', handleClose)
    return () => dialog.removeEventListener('close', handleClose)
  }, [])

  // If the dialog unmounts while open (e.g. a route change), still restore focus.
  useEffect(() => {
    const el = opener
    return () => {
      if (el.current?.isConnected && !document.querySelector('dialog[open]')) el.current.focus()
    }
  }, [])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      // A click whose target is the <dialog> itself landed on the backdrop,
      // because the inner panel covers all of the dialog's own box.
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close()
      }}
      className={cn(
        'bg-transparent p-0 text-ink backdrop:animate-fade-in open:flex',
        side === 'center' && 'm-auto max-h-[88dvh] w-[calc(100vw-2rem)] animate-pop',
        side === 'center' && { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-3xl' }[size],
        side === 'left' && 'm-0 h-dvh max-h-dvh w-[min(20rem,86vw)] max-w-none animate-drawer',
        className,
      )}
    >
      <div
        className={cn(
          'flex w-full flex-col overflow-hidden border border-line bg-raised shadow-pop',
          side === 'center' ? 'rounded-card' : 'h-full border-y-0 border-l-0',
        )}
      >
        <header className={cn('flex items-start justify-between gap-4 px-5 pt-5', hideTitle && 'pt-3')}>
          <div className="min-w-0">
            <h2 id={titleId} className={cn('text-lg font-bold', hideTitle && 'sr-only')}>
              {title}
            </h2>
            {description && (
              <p id={descId} className="mt-1 text-sm text-muted">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            className="-mt-1 -mr-2 ml-auto grid size-9 shrink-0 place-items-center rounded-control text-muted hover:bg-sunken hover:text-ink"
          >
            <X aria-hidden className="size-5" />
            <span className="sr-only">Close</span>
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-4 pb-5">{children}</div>
        {footer && <footer className="flex flex-wrap justify-end gap-2 border-t border-line px-5 py-4">{footer}</footer>}
      </div>
    </dialog>
  )
}
