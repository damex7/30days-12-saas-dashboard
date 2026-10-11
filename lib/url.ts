/**
 * Builds a URL from the current query plus some changes, dropping empty
 * values. Used by sortable table headers, pagination and filters, which
 * all keep their state in the URL so it survives a refresh and can be shared.
 *
 *   hrefWith('/invoices', { status: 'paid', page: '3' }, { page: null })
 *   → '/invoices?status=paid'
 */
export type Query = Record<string, string | string[] | undefined>

export function hrefWith(pathname: string, current: Query, changes: Record<string, string | number | null | undefined> = {}) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(current)) {
    const v = Array.isArray(value) ? value[0] : value
    if (v) params.set(key, v)
  }
  for (const [key, value] of Object.entries(changes)) {
    if (value === null || value === undefined || value === '') params.delete(key)
    else params.set(key, String(value))
  }
  const qs = params.toString()
  return qs ? `${pathname}?${qs}` : pathname
}

/** The first value of a search param, whether it arrived as a string or an array. */
export const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)
