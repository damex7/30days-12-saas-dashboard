// CLIENT COMPONENT, even though it has no state: the `typeof window` check
// below must run in the browser on a client-side navigation. As a Server
// Component it would always run on the server and always say "javascript".
'use client'

/**
 * InlineScript: a <script> that runs while the browser parses the server's
 * HTML, before first paint.
 *
 * Why not a plain <script>? When React renders this component in the browser
 * (a client-side navigation into the app, e.g. from /login), the script
 * would never run anyway, and React warns in development that it found a
 * <script> tag. So the server emits type="text/javascript" (runs on a full
 * page load) and the browser renders type="text/plain" (inert, no warning).
 * suppressHydrationWarning accepts that one attribute difference.
 *
 * Whatever the script does must also be done by a Client Component for
 * client-side navigations (see the useLayoutEffect in Sidebar).
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === 'undefined' ? 'text/javascript' : 'text/plain'}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
