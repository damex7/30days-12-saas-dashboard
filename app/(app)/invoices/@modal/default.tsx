// DEFAULT for the @modal slot: render nothing.
//
// This one does real work. On a FULL page load of /invoices, /invoices/new
// or /invoices/INV-0042, Next.js matches each slot against the URL. The
// @modal slot has no page for those URLs (interception only happens on
// client-side navigation), so without this file the route would error.
// With it, the slot quietly renders null and no modal shows.
export default function ModalDefault() {
  return null
}
