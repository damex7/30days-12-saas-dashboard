// APP ERROR BOUNDARY: app/(app)/error.tsx
//
// Catches errors thrown by any app page (dashboard, invoices, clients...).
// It sits INSIDE app/(app)/layout.tsx, so when a page fails the sidebar and
// top bar stay on screen and you can navigate away. (An error.tsx never
// catches errors in the layout of its own folder; those go up to the next
// boundary.) The dashboard's slots have their own, closer error.tsx files,
// so a failing panel never reaches this one.
'use client'

import { RotateCw, TriangleAlert } from 'lucide-react'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'

export default function AppError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Card role="alert">
      <EmptyState
        icon={<TriangleAlert />}
        title="This page couldn’t load"
        description={`Something went wrong on our side. Try again, or pick another page from the menu.${error.digest ? ` (Reference: ${error.digest})` : ''}`}
        action={
          <>
            <Button onClick={() => retry()}>
              <RotateCw aria-hidden /> Try again
            </Button>
            <Button href="/dashboard" variant="secondary">
              Back to dashboard
            </Button>
          </>
        }
      />
    </Card>
  )
}
