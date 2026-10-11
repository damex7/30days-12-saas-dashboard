// TEMPLATE: app/(auth)/template.tsx
//
// A template wraps its pages exactly like a layout does, with one big
// difference: it REMOUNTS on every navigation between the pages under it.
// Next.js gives it a new `key` each time, so React throws away the old
// DOM and state and builds fresh ones.
//
//   layout.tsx   → mounted once, persists (state kept, no re-animation)
//   template.tsx → new instance per page (state reset, effects and CSS
//                  animations run again)
//
// Here that's exactly what we want: going from /login to /signup plays the
// fade-in again, and a half-typed login form doesn't leak into the sign-up
// form. The brand panel in the layout above doesn't flicker, because the
// layout isn't remounted, only this template and what's inside it.
//
// It's still a Server Component: the animation is plain CSS
// (`animate-rise`), which restarts because the element is brand new.
// Reduced-motion users get no animation (see globals.css).

export default function AuthTemplate({ children }: { children: React.ReactNode }) {
  return <div className="animate-rise">{children}</div>
}
