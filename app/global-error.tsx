// GLOBAL ERROR: the last-resort boundary, used only when the ROOT layout
// itself throws. It replaces the root layout, so it must render its own
// <html> and <body>, and it gets none of our fonts or global CSS. Hence the
// inline styles. Every other error is caught by a closer error.tsx that keeps
// the surrounding layouts on screen.
'use client'

export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en-NG">
      <body style={{ fontFamily: 'system-ui, sans-serif', display: 'grid', placeItems: 'center', minHeight: '100dvh', margin: 0 }}>
        <title>Something went wrong · Owó</title>
        <main style={{ textAlign: 'center', padding: 24 }}>
          <h1 style={{ fontSize: 24 }}>Owó hit a problem it couldn’t recover from.</h1>
          <p style={{ color: '#52615f' }}>Please try again. If it keeps happening, reload the page.</p>
          <button
            type="button"
            onClick={() => retry()}
            style={{ marginTop: 16, padding: '10px 18px', borderRadius: 10, border: 0, background: '#0e4d52', color: '#fff', fontWeight: 600 }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  )
}
