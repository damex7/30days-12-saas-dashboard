import { Plus } from 'lucide-react'
import type { Faq as FaqItem } from '@/lib/types'

/**
 * Faq: an accessible accordion with ZERO JavaScript.
 *
 * Native <details>/<summary> already does everything an accordion needs:
 * keyboard (Enter/Space), the expanded/collapsed state for screen readers,
 * find-in-page opens the matching answer, and it works before hydration.
 * The `group-open:` styles rotate the icon. The same component is reused on
 * the landing page and the pricing page.
 */
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="mx-auto max-w-3xl divide-y divide-line rounded-card border border-line bg-raised shadow-card">
      {items.map((item) => (
        <details key={item.question} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-ink hover:text-brand sm:px-6">
            {item.question}
            <Plus aria-hidden className="size-5 shrink-0 text-muted transition-transform group-open:rotate-45" />
          </summary>
          <p className="px-5 pb-5 text-muted sm:px-6">{item.answer}</p>
        </details>
      ))}
    </div>
  )
}
