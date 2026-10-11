// ⚠️ THIS IS NOT REAL AUTHENTICATION. ⚠️
//
// Owó's "sign in" sets a cookie that only says "this browser clicked
// Sign in". It holds no user id, isn't signed or encrypted, and anyone can
// create it in DevTools. It exists so the layouts, the proxy redirect and
// the sign-out flow can be built and studied today. Real accounts (hashed
// passwords, sessions, a users table) arrive on Day 16 with the database.
//
// No 'server-only' here on purpose: proxy.ts imports these constants too.

export const DEMO_COOKIE = 'owo_demo'

/** Only allow redirects back into our own app, never to another site (?next=https://evil.example). */
export function safeNext(next: unknown): string {
  return typeof next === 'string' && next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard'
}
