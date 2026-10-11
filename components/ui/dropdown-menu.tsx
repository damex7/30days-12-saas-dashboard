// CLIENT COMPONENT: a menu is open/closed state, keyboard handling and
// focus movement, all of which happen in the browser.
'use client'

import Link from 'next/link'
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/cn'

const MenuContext = createContext<{ close: (refocus?: boolean) => void } | null>(null)

type DropdownMenuProps = {
  /** What the trigger button shows. Include text (visible or sr-only) so it has a name. */
  trigger: ReactNode
  triggerClassName?: string
  /** Which edge of the trigger the menu lines up with. */
  align?: 'start' | 'end'
  menuClassName?: string
  children: ReactNode
}

/**
 * DropdownMenu: a button that opens a list of actions or links.
 *
 *   <DropdownMenu trigger={<><Bell /> <span className="sr-only">Notifications</span></>}>
 *     <MenuLabel>Today</MenuLabel>
 *     <MenuItem href="/invoices/INV-0042">INV-0042 was paid</MenuItem>
 *     <MenuSeparator />
 *     <MenuItem action={signOut}>Sign out</MenuItem>
 *   </DropdownMenu>
 *
 * Keyboard (the WAI-ARIA menu button pattern):
 * - Enter, Space or ↓ on the trigger opens it and focuses the first item; ↑ the last.
 * - ↑/↓ move between items (wrapping), Home/End jump to the ends, and
 *   typing a letter jumps to the next item starting with it.
 * - Esc closes and puts focus back on the trigger; Tab closes and moves on.
 * Only the focused item is in the tab order ("roving focus"): items have
 * tabIndex={-1} and we move focus with the arrow keys.
 *
 * Composition: items are children, not an `items={[...]}` array, so a menu
 * can mix links, actions, labels, separators or custom content.
 */
export function DropdownMenu({ trigger, triggerClassName, align = 'end', menuClassName, children }: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const focusOnOpen = useRef<'first' | 'last'>('first')
  const menuId = useId()
  const triggerId = useId()

  const items = () =>
    Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])') ?? [])

  const close = useCallback((refocus = true) => {
    setOpen(false)
    if (refocus) triggerRef.current?.focus()
  }, [])

  // Focus the first (or last) item once the menu has rendered.
  useEffect(() => {
    if (!open) return
    const list = items()
    ;(focusOnOpen.current === 'last' ? list.at(-1) : list[0])?.focus()
  }, [open])

  // Close when clicking anywhere outside the menu and its trigger.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (!menuRef.current?.contains(target) && !triggerRef.current?.contains(target)) close(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open, close])

  const openWith = (where: 'first' | 'last') => {
    focusOnOpen.current = where
    setOpen(true)
  }

  const onTriggerKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      openWith('first')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      openWith('last')
    }
  }

  const onMenuKeyDown = (e: KeyboardEvent) => {
    const list = items()
    const index = list.indexOf(document.activeElement as HTMLElement)
    const move = (i: number) => list[(i + list.length) % list.length]?.focus()

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        move(index + 1)
        break
      case 'ArrowUp':
        e.preventDefault()
        move(index - 1)
        break
      case 'Home':
        e.preventDefault()
        move(0)
        break
      case 'End':
        e.preventDefault()
        move(list.length - 1)
        break
      case 'Escape':
        e.preventDefault()
        // Stop a surrounding <dialog> from also closing on this Esc.
        e.stopPropagation()
        close()
        break
      case 'Tab':
        close(false)
        break
      default:
        // Typeahead: jump to the next item whose text starts with the key.
        if (e.key.length === 1 && /\S/.test(e.key)) {
          const ch = e.key.toLowerCase()
          const after = [...list.slice(index + 1), ...list.slice(0, index + 1)]
          after.find((el) => el.textContent?.trim().toLowerCase().startsWith(ch))?.focus()
        }
    }
  }

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => (open ? close(false) : openWith('first'))}
        onKeyDown={onTriggerKeyDown}
        className={triggerClassName}
      >
        {trigger}
      </button>
      {open && (
        <MenuContext value={{ close }}>
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-labelledby={triggerId}
            onKeyDown={onMenuKeyDown}
            className={cn(
              'absolute top-full z-50 mt-2 w-[min(18rem,calc(100vw-2rem))] origin-top animate-pop rounded-card border border-line bg-raised p-1.5 shadow-pop',
              align === 'end' ? 'right-0' : 'left-0',
              menuClassName,
            )}
          >
            {children}
          </div>
        </MenuContext>
      )}
    </div>
  )
}

const itemClass =
  'flex w-full items-center gap-3 rounded-control px-3 py-2 text-left text-sm text-ink outline-none hover:bg-sunken focus-visible:bg-brand-soft focus-visible:outline-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted'

type MenuItemProps = {
  children: ReactNode
  className?: string
  /** A link item. */
  href?: string
  /** A click handler (from a Client Component). */
  onSelect?: () => void
  /** A Server Action (can be passed straight from a Server Component). */
  action?: () => Promise<void>
  tone?: 'default' | 'danger'
}

/** One entry in a DropdownMenu: a link (href), a handler (onSelect) or a Server Action (action). */
export function MenuItem({ children, className, href, onSelect, action, tone = 'default' }: MenuItemProps) {
  const ctx = use(MenuContext)
  const [pending, startTransition] = useTransition()
  const cls = cn(itemClass, tone === 'danger' && 'text-danger [&_svg]:text-danger', className)

  if (href) {
    return (
      <Link href={href} role="menuitem" tabIndex={-1} className={cls} onClick={() => ctx?.close(false)}>
        {children}
      </Link>
    )
  }
  return (
    <button
      type="button"
      role="menuitem"
      tabIndex={-1}
      aria-disabled={pending || undefined}
      className={cls}
      onClick={() => {
        onSelect?.()
        if (action) startTransition(action)
        else ctx?.close()
      }}
    >
      {children}
    </button>
  )
}

/** A non-interactive heading inside a menu. */
export function MenuLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div role="presentation" className={cn('px-3 pt-2 pb-1 text-xs font-semibold tracking-wide text-muted uppercase', className)}>
      {children}
    </div>
  )
}

export function MenuSeparator() {
  return <div role="separator" className="my-1.5 h-px bg-line" />
}
