import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/cn'
import type { Testimonial as TestimonialData } from '@/lib/types'

/**
 * Testimonial: a quote and who said it, as <figure> + <blockquote> +
 * <figcaption>, the HTML that actually means "a quotation and its source".
 *
 * The same component appears in three places with different looks:
 * a card on the landing page, a bigger version on /customers (`size="lg"`),
 * and the side panel of the auth layout (`tone="brand"`). Shown results are
 * opt-in via `showResult`.
 */
export function Testimonial({
  testimonial: t,
  size = 'md',
  tone = 'card',
  showResult,
  className,
}: {
  testimonial: TestimonialData
  size?: 'md' | 'lg'
  tone?: 'card' | 'brand'
  showResult?: boolean
  className?: string
}) {
  return (
    <figure
      className={cn(
        'flex h-full flex-col gap-5',
        tone === 'card' && 'rounded-card border border-line bg-raised p-6 shadow-card',
        tone === 'brand' && 'text-brand-ink',
        className,
      )}
    >
      {showResult && t.result && (
        <p className="w-fit rounded-pill bg-accent-soft px-3 py-1 text-xs font-bold text-ink">{t.result}</p>
      )}
      <blockquote className={cn('flex-1', size === 'lg' ? 'text-xl leading-relaxed' : 'text-base leading-relaxed', tone === 'card' && 'text-ink')}>
        <p>“{t.quote}”</p>
      </blockquote>
      <figcaption className="flex items-center gap-3">
        <Avatar name={t.name} decorative />
        <div className="text-sm">
          <p className="font-bold">{t.name}</p>
          <p className={tone === 'brand' ? 'opacity-80' : 'text-muted'}>
            {t.role}, {t.business} · {t.city}
          </p>
        </div>
      </figcaption>
    </figure>
  )
}
