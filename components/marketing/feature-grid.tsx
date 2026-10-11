import { BarChart3, BellRing, MessageCircle, Printer, Receipt, Users, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { Feature } from '@/lib/types'

// Content stores an icon NAME (plain data, ready for a CMS or database);
// this map turns it into a component at render time.
const icons: Record<string, LucideIcon> = {
  receipt: Receipt,
  whatsapp: MessageCircle,
  bell: BellRing,
  chart: BarChart3,
  printer: Printer,
  users: Users,
}

/**
 * FeatureGrid: icon, title and a sentence, in a responsive grid.
 * Takes the features as data, so the landing page shows all six and could
 * show a subset elsewhere. `columns` is the one layout knob.
 */
export function FeatureGrid({ features, columns = 3, className }: { features: Feature[]; columns?: 2 | 3; className?: string }) {
  return (
    <ul className={cn('grid gap-x-8 gap-y-10 sm:grid-cols-2', columns === 3 && 'lg:grid-cols-3', className)}>
      {features.map((f) => {
        const Icon = icons[f.icon] ?? Receipt
        return (
          <li key={f.title} className="flex flex-col gap-3">
            <span aria-hidden className="grid size-11 place-items-center rounded-card bg-brand text-brand-ink shadow-raised">
              <Icon className="size-5" />
            </span>
            <h3 className="text-lg font-bold text-ink">{f.title}</h3>
            <p className="text-muted">{f.body}</p>
          </li>
        )
      })}
    </ul>
  )
}
