// CLIENT COMPONENT: it responds to clicks and reads/writes localStorage,
// and both only exist in the browser.
'use client'

import { Monitor, Moon, Sun } from 'lucide-react'
import { useSyncExternalStore } from 'react'
import { cn } from '@/lib/cn'
import { THEME_STORAGE_KEY, type ThemeChoice } from '@/lib/theme'

const CHANGE_EVENT = 'owo-theme-change'

const options = [
  { value: 'system', label: 'System', Icon: Monitor },
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
] as const

function readChoice(): ThemeChoice {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY)
    return saved === 'light' || saved === 'dark' ? saved : 'system'
  } catch {
    return 'system'
  }
}

function subscribe(onChange: () => void) {
  // `storage` fires when another tab changes the theme; our own event covers this tab.
  window.addEventListener('storage', onChange)
  window.addEventListener(CHANGE_EVENT, onChange)
  return () => {
    window.removeEventListener('storage', onChange)
    window.removeEventListener(CHANGE_EVENT, onChange)
  }
}

function choose(choice: ThemeChoice) {
  try {
    if (choice === 'system') localStorage.removeItem(THEME_STORAGE_KEY)
    else localStorage.setItem(THEME_STORAGE_KEY, choice)
  } catch {
    // Storage blocked (some private modes): still switch for this visit.
  }
  // "System" removes the attribute so CSS `color-scheme: light dark` follows the OS again.
  if (choice === 'system') delete document.documentElement.dataset.theme
  else document.documentElement.dataset.theme = choice
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

/**
 * Three-way theme switch: System / Light / Dark.
 * A group of toggle buttons with aria-pressed, not a dropdown, because three
 * options fit and one click beats two.
 */
export function ThemeToggle({ className }: { className?: string }) {
  // The server can't see localStorage, so it renders with nothing pressed
  // (the server snapshot is null) and the browser fills in the real choice
  // after hydration. Colours are already right by then: the <head> script
  // set them before the first paint.
  const current = useSyncExternalStore<ThemeChoice | null>(subscribe, readChoice, () => null)

  return (
    <div
      role="group"
      aria-label="Colour theme"
      className={cn('inline-flex items-center rounded-pill border border-line bg-raised p-0.5', className)}
    >
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          aria-pressed={current === value}
          title={`${label} theme`}
          onClick={() => choose(value)}
          className={cn(
            'grid size-7 place-items-center rounded-pill text-muted transition-colors hover:text-ink',
            current === value && 'bg-brand text-brand-ink hover:text-brand-ink',
          )}
        >
          <Icon aria-hidden className="size-3.5" />
          <span className="sr-only">{label} theme</span>
        </button>
      ))}
    </div>
  )
}
