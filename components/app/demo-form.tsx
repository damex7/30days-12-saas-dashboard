// CLIENT COMPONENT: handles submit in the browser to show a toast.
'use client'

import type { FormEvent, ReactNode } from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CardFooter } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast'

/**
 * DemoForm: a form whose fields are passed in as `children`, so a Server
 * Component page can render the fields (with data from lib/data.ts) inside
 * this client wrapper. Saving only shows a toast: settings aren't stored
 * until the database arrives.
 */
export function DemoForm({ children, submitLabel = 'Save changes', savedMessage }: { children: ReactNode; submitLabel?: string; savedMessage: string }) {
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    await new Promise((r) => setTimeout(r, 500))
    setSaving(false)
    toast({ title: savedMessage, description: 'Demo only: nothing is stored yet.' })
  }

  return (
    <form onSubmit={onSubmit}>
      {children}
      <CardFooter className="justify-end">
        <Button type="submit" loading={saving}>
          {submitLabel}
        </Button>
      </CardFooter>
    </form>
  )
}
