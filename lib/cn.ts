import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Joins class names and resolves Tailwind conflicts.
 *
 * - clsx handles conditionals: cn('px-4', isActive && 'bg-brand').
 * - tailwind-merge makes the LAST conflicting class win, so a component's
 *   defaults can be overridden from outside: <Button className="px-8"> drops
 *   the button's own `px-4` instead of shipping both and hoping CSS order
 *   picks the right one.
 *
 * Every component that accepts `className` passes it through cn() last.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
