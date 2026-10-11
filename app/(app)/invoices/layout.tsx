// INVOICES LAYOUT: app/(app)/invoices/layout.tsx
//
// It renders two things side by side: `children` (the list, a full invoice
// page or the new-invoice form) and `modal`, the @modal PARALLEL ROUTE SLOT.
//
// @modal is how the QUICK-VIEW MODAL works (an INTERCEPTING ROUTE):
// - Click an invoice in the list → a client-side navigation to
//   /invoices/INV-0042. The folder @modal/(.)[id] INTERCEPTS it: the URL
//   changes, but instead of replacing the list, Next.js renders the
//   intercepted page into the @modal slot, over the list.
// - Refresh, or open that URL directly / in a new tab → there's no list to
//   overlay, so no interception: you get the full page, invoices/[id].
//
// "(.)" means "intercept a segment at the SAME level", like ./ in a file
// path: (.)[id] next to the list catches invoices/[id]. Other forms:
// (..) one level up, (..)(..) two up, (...) from the app root. They count
// ROUTE segments, so the @modal folder itself doesn't count as a level.

export default function InvoicesLayout({ children, modal }: LayoutProps<'/invoices'>) {
  return (
    <>
      {children}
      {modal}
    </>
  )
}
