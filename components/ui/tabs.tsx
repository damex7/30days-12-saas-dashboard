// CLIENT COMPONENT: which tab is selected is state, and the arrow-key
// handling runs in the browser. The PANELS can still be Server Components:
// they arrive as already-rendered `panel` props.
'use client'

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type TabItem = { value: string; label: ReactNode; panel: ReactNode }

/**
 * Tabs: switch between panels of content IN THE SAME PAGE.
 * (For tabs that are separate URLs, like Settings, use <LinkTabs>: those
 * are navigation, and belong in a <nav> with real links.)
 *
 * The WAI-ARIA tabs pattern:
 * - role="tablist" / "tab" / "tabpanel", linked by ids;
 * - only the selected tab is in the tab order; ←/→ move between tabs and
 *   select them, Home/End jump to the ends;
 * - Tab from the selected tab goes into its panel.
 * Hidden panels use the `hidden` attribute, so they stay in the HTML (good
 * for search and no-JS) but are skipped by everyone.
 */
export function Tabs({
  items,
  label,
  defaultValue,
  className,
}: {
  items: TabItem[]
  /** Names the tablist for screen readers, e.g. "Button examples". */
  label: string
  defaultValue?: string
  className?: string
}) {
  const [selected, setSelected] = useState(defaultValue ?? items[0]?.value)
  const baseId = useId()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const onKeyDown = (e: KeyboardEvent, index: number) => {
    const last = items.length - 1
    const to = { ArrowRight: index === last ? 0 : index + 1, ArrowLeft: index === 0 ? last : index - 1, Home: 0, End: last }[e.key]
    if (to === undefined) return
    e.preventDefault()
    setSelected(items[to].value)
    tabRefs.current[to]?.focus()
  }

  return (
    <div className={className}>
      <div role="tablist" aria-label={label} className="flex gap-1 overflow-x-auto border-b border-line">
        {items.map((item, i) => {
          const isSelected = item.value === selected
          return (
            <button
              key={item.value}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${item.value}`}
              aria-controls={`${baseId}-panel-${item.value}`}
              aria-selected={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setSelected(item.value)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                '-mb-px border-b-2 px-3 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors',
                isSelected ? 'border-brand text-ink' : 'border-transparent text-muted hover:text-ink',
              )}
            >
              {item.label}
            </button>
          )
        })}
      </div>
      {items.map((item) => (
        <div
          key={item.value}
          role="tabpanel"
          id={`${baseId}-panel-${item.value}`}
          aria-labelledby={`${baseId}-tab-${item.value}`}
          hidden={item.value !== selected}
          tabIndex={0}
          className="pt-5 focus-visible:outline-offset-4"
        >
          {item.panel}
        </div>
      ))}
    </div>
  )
}
