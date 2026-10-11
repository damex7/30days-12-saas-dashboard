import type { Kobo } from '@/lib/types'

/*
  MONEY RULE (same as my Day 9 storefront): every amount in Owó is a whole
  number of KOBO (₦1 = 100 kobo). Kobo only become "₦16,000" when printed,
  and that happens in exactly one place: formatNaira() below.

  Why not naira with decimals? JavaScript numbers are binary floating point:
      0.1 + 0.2            → 0.30000000000000004
      19.99 * 7            → 139.92999999999998
  An invoice total that is off by a kobo is a bug a client will notice.
  Integers don't drift: 1999 * 7 → 13993, exactly. So we add and multiply
  integers and round ONCE, on purpose, where a percentage creates a fraction.
*/

/** True for a valid amount: a whole, non-negative number of kobo. */
export const isKobo = (v: unknown): v is Kobo => Number.isSafeInteger(v) && (v as number) >= 0

/** Whole naira (e.g. typed into a form) to kobo. */
export const nairaToKobo = (naira: number): Kobo => Math.round(naira * 100)

/** Kobo to a plain number of naira for an <input type="number"> value. */
export const koboToNaira = (kobo: Kobo): number => kobo / 100

/** Add up amounts. Integers in, integer out. */
export const sumKobo = (amounts: Kobo[]): Kobo => amounts.reduce((total, k) => total + k, 0)

/*
  VAT in Nigeria is 7.5%. Stored in BASIS POINTS (1 bp = 0.01%) so the rate
  itself is an integer too: 7.5% = 750 bp.
*/
export const VAT_BPS = 750
export const VAT_LABEL = 'VAT (7.5%)'

/**
 * A rate in basis points applied to an amount, rounded to the nearest kobo
 * (halves round up). The ONE place a percentage becomes money.
 * 7.5% of ₦12,345.67 (1,234,567 kobo) = 92,592.525 kobo → 92,593 kobo.
 */
export function applyBps(kobo: Kobo, bps: number): Kobo {
  return Math.round((kobo * bps) / 10_000)
}

const whole = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  currencyDisplay: 'narrowSymbol', // "₦", not "NGN"
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})
const withKobo = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  currencyDisplay: 'narrowSymbol',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
const compact = new Intl.NumberFormat('en-NG', { notation: 'compact', maximumFractionDigits: 1 })

/**
 * THE place kobo becomes text. Whole-naira amounts drop the ".00" (₦16,000);
 * anything with kobo shows two decimals (₦16,000.50). Negative amounts use a
 * real minus sign (−₦2,000).
 */
export function formatNaira(kobo: Kobo): string {
  if (!Number.isFinite(kobo)) return '₦—'
  const abs = Math.abs(kobo)
  const text = (abs % 100 === 0 ? whole : withKobo).format(abs / 100)
  return kobo < 0 ? `−${text}` : text
}

/** Short form for chart axes and tight spaces: ₦1.2M, ₦850K. */
export function formatNairaCompact(kobo: Kobo): string {
  return `₦${compact.format(Math.round(kobo / 100))}`
}
