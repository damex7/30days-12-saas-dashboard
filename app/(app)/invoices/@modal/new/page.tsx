// The @modal slot's page for /invoices/new: nothing.
//
// Two jobs:
// 1. During CLIENT-SIDE navigation a slot keeps showing what it last
//    matched, so this closes any open modal when you go to /invoices/new.
// 2. A static segment ("new") beats a dynamic one, so (.)[id] doesn't
//    treat "new" as an invoice id and intercept the form into the modal.
//
// Why not a catch-all ([...catchAll]) like the Next.js docs example?
// Next.js 16 checks that every page belongs to a COMPLETE route: the
// children slot would need a page for every URL the catch-all matches
// (/invoices/a/b/c...), and it doesn't, so the build rejects it.
export default function NoModalOnNew() {
  return null
}
