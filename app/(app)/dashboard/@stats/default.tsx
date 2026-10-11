// DEFAULT for the @stats slot.
//
// On a client-side navigation Next.js remembers what each slot was showing.
// On a FULL page load it can only match slots against the URL, and a named
// slot with no matching page needs a default.tsx, or the route errors.
// /dashboard has no sub-pages today, so this never shows; it's the safety
// net for the day someone adds /dashboard/something without a matching
// @stats page. (The @modal slot in invoices/ is where default.tsx does real
// work every day.)
export default function StatsDefault() {
  return null
}
