import Link from 'next/link'
import { cn } from '@/lib/cn'

/**
 * The Owó mark: a cowrie shell, the money of West Africa before coins.
 * Drawn as an inline SVG so it inherits the theme tokens (no separate dark
 * logo file) and costs no extra request.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 32 32" className={cn('size-8 shrink-0', className)}>
      <rect width="32" height="32" rx="9" className="fill-brand" />
      <ellipse cx="16" cy="16" rx="8" ry="11" className="fill-accent" transform="rotate(-18 16 16)" />
      <path
        d="M18.3 6.6c-2.6 3.1-3.9 6.2-4 9.4-.1 3.1.9 6.2 2.9 9.4"
        className="fill-none stroke-brand"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M15.4 9.6l-1.9-.4M14.4 12.6l-2-.1M14 15.7h-2M14.3 18.8l-2 .3M15.2 21.8l-1.9.6M17.6 10.4l1.8.6M17 13.4l2 .3M16.8 16.5l2 .1M17.1 19.5l2-.2"
        className="stroke-brand"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Mark + wordmark, linking home. `href` changes where it goes (the app links to /dashboard). */
export function Logo({ href = '/', className, compactOnCollapse }: { href?: string; className?: string; compactOnCollapse?: boolean }) {
  return (
    <Link href={href} className={cn('inline-flex items-center gap-2.5 rounded-control', className)}>
      <LogoMark />
      <span
        className={cn(
          'font-display text-xl font-extrabold tracking-tight text-ink',
          // In the collapsed sidebar only the mark shows.
          compactOnCollapse && 'md:sidebar-collapsed:sr-only',
        )}
      >
        Owó
      </span>
    </Link>
  )
}
