import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const avatarVariants = cva('inline-grid shrink-0 place-items-center rounded-pill font-semibold select-none', {
  variants: {
    size: { sm: 'size-7 text-[0.6875rem]', md: 'size-9 text-xs', lg: 'size-14 text-lg' },
  },
  defaultVariants: { size: 'md' },
})

// Token pairs, so every avatar colour works in light and dark mode.
const palettes = [
  'bg-brand-soft text-brand-strong',
  'bg-accent-soft text-ink',
  'bg-paid-soft text-paid',
  'bg-sent-soft text-sent',
  'bg-draft-soft text-draft',
]

/** "Kémi Adébáyọ̀" → "KA". Strips accents so the initials are plain capitals. */
export function initials(name: string) {
  const words = name.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z ]/g, ' ').split(/\s+/).filter(Boolean)
  return ((words[0]?.[0] ?? '') + (words.length > 1 ? words.at(-1)![0] : '')).toUpperCase() || '?'
}

/**
 * Avatar: initials on a colour picked from the name.
 * The same name always gets the same colour (a simple hash), so a client is
 * recognisable across the app. When a name is printed right beside it, pass
 * `decorative` so screen readers don't read the name twice.
 */
export function Avatar({
  name,
  decorative,
  size,
  className,
}: { name: string; decorative?: boolean; className?: string } & VariantProps<typeof avatarVariants>) {
  let hash = 0
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0
  return (
    <span
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : name}
      aria-hidden={decorative || undefined}
      className={cn(avatarVariants({ size }), palettes[hash % palettes.length], className)}
    >
      {initials(name)}
    </span>
  )
}
