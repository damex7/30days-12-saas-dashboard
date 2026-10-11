import type { ISODate } from '@/lib/types'

/*
  Invoices are dated by calendar day ("issued 3 Oct"), so dates are plain
  'YYYY-MM-DD' strings. All maths runs in UTC on those strings, which means
  the server (UTC on Vercel) and a browser in Lagos always agree on what day
  an invoice is due, and formatting can never shift a date by one.
*/

const DAY_MS = 86_400_000

/** Today's date in Lagos, whatever timezone the server runs in. */
export function todayInLagos(now = new Date()): ISODate {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Lagos' }).format(now)
}

const toUTC = (iso: ISODate) => Date.parse(`${iso}T00:00:00Z`)
const fromUTC = (ms: number): ISODate => new Date(ms).toISOString().slice(0, 10)

export const addDays = (iso: ISODate, days: number): ISODate => fromUTC(toUTC(iso) + days * DAY_MS)

/** Whole days from `a` to `b` (positive when b is later). */
export const daysBetween = (a: ISODate, b: ISODate): number => Math.round((toUTC(b) - toUTC(a)) / DAY_MS)

/** 'YYYY-MM' of a date, for grouping by month. */
export const monthKey = (iso: ISODate): string => iso.slice(0, 7)

/** The 'YYYY-MM' that is `n` months before the month of `iso`. */
export function monthsBefore(iso: ISODate, n: number): string {
  const [y, m] = iso.split('-').map(Number)
  const d = new Date(Date.UTC(y, m - 1 - n, 1))
  return d.toISOString().slice(0, 7)
}

const dateFmt = new Intl.DateTimeFormat('en-NG', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
const shortFmt = new Intl.DateTimeFormat('en-NG', { day: 'numeric', month: 'short', timeZone: 'UTC' })
const monthFmt = new Intl.DateTimeFormat('en-NG', { month: 'short', timeZone: 'UTC' })
const longMonthFmt = new Intl.DateTimeFormat('en-NG', { month: 'long', year: 'numeric', timeZone: 'UTC' })

/** "3 Oct 2026" */
export const formatDate = (iso: ISODate) => dateFmt.format(toUTC(iso))
/** "3 Oct" */
export const formatShortDate = (iso: ISODate) => shortFmt.format(toUTC(iso))
/** "Oct" from 'YYYY-MM' */
export const formatMonth = (month: string) => monthFmt.format(toUTC(`${month}-01`))
/** "October 2026" from 'YYYY-MM' */
export const formatLongMonth = (month: string) => longMonthFmt.format(toUTC(`${month}-01`))

/** "today", "yesterday", "3 days ago", or a date once it's over a week old. */
export function formatRelative(iso: ISODate, today: ISODate): string {
  const days = daysBetween(iso, today)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  return formatShortDate(iso)
}
