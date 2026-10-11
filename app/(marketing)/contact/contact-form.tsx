// CLIENT COMPONENT: validates as you submit and shows a toast. UI only:
// nothing is sent anywhere in this demo.
'use client'

import { useRef, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input, Select, Textarea } from '@/components/ui/form-controls'
import { useToast } from '@/components/ui/toast'

type Errors = Partial<Record<'name' | 'email' | 'message', string>>

function validate(data: FormData): Errors {
  const errors: Errors = {}
  if (!String(data.get('name') ?? '').trim()) errors.name = 'Please tell us your name.'
  const email = String(data.get('email') ?? '').trim()
  if (!email) errors.email = 'Enter your email so we can reply.'
  else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'That email doesn’t look right. Check for a typo.'
  if (String(data.get('message') ?? '').trim().length < 10) errors.message = 'Write at least a sentence (10 characters).'
  return errors
}

export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({})
  const [sending, setSending] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const { toast } = useToast()

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const found = validate(new FormData(e.currentTarget))
    setErrors(found)
    const firstInvalid = Object.keys(found)[0]
    if (firstInvalid) {
      // Move focus to the first problem: the error is read out with it.
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }
    setSending(true)
    await new Promise((r) => setTimeout(r, 700)) // pretend to send
    setSending(false)
    formRef.current?.reset()
    toast({ title: 'Message sent', description: 'Thanks! We’ll reply within one working day. (Demo: nothing was actually sent.)' })
  }

  return (
    // noValidate: we show our own accessible messages instead of the browser's bubbles.
    <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <Field name="name" label="Your name" error={errors.name} required>
        {(control) => <Input {...control} autoComplete="name" />}
      </Field>
      <Field name="email" label="Email" error={errors.email} required>
        {(control) => <Input {...control} type="email" autoComplete="email" inputMode="email" />}
      </Field>
      <Field name="topic" label="Topic" className="sm:col-span-2">
        {(control) => (
          <Select {...control} defaultValue="plans">
            <option value="plans">Plans and pricing</option>
            <option value="vat">VAT and invoices</option>
            <option value="team">Teams and accounts</option>
            <option value="other">Something else</option>
          </Select>
        )}
      </Field>
      <Field name="message" label="Message" hint="The more detail, the faster we can help." error={errors.message} required className="sm:col-span-2">
        {(control) => <Textarea {...control} rows={5} />}
      </Field>
      <div className="sm:col-span-2">
        <Button type="submit" loading={sending}>
          Send message
        </Button>
      </div>
    </form>
  )
}
