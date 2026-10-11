// The marketing nav links, in a plain module (no 'use client').
//
// Why its own file: a Server Component that imports a VALUE from a
// 'use client' file doesn't get the value, it gets a "client reference"
// (a pointer for the browser bundle). Importing this array from
// marketing-nav.tsx into the server-rendered header crashed the build with
// "marketingLinks.map is not a function". Shared data lives in shared modules.
export const marketingLinks = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/customers', label: 'Customers' },
  { href: '/changelog', label: 'Changelog' },
  { href: '/contact', label: 'Contact' },
]
