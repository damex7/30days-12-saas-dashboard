// The @modal slot's page for /invoices itself: nothing.
//
// During CLIENT-SIDE navigation a slot keeps showing whatever it last
// matched. So if you navigate from an open modal to /invoices with a <Link>
// (not Back), the slot needs a page that matches /invoices and renders
// null, or the modal would stay open over the list.
export default function NoModal() {
  return null
}
