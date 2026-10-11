// CLIENT COMPONENT: window.print() is a browser API.
'use client'

import { Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'

/** Opens the browser's print dialog (which also offers "Save as PDF"). */
export function PrintButton() {
  return (
    <Button variant="secondary" onClick={() => window.print()}>
      <Printer aria-hidden /> Print or save PDF
    </Button>
  )
}
