// CLIENT COMPONENTS: useActionState keeps the Server Action's last result
// (the error messages) and the pending state in the browser.
'use client'

import { CheckCircle2, Info } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useActionState } from 'react'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/form-controls'
import { SubmitButton } from '@/components/ui/submit-button'
import { requestPasswordReset, signIn, signUp, type AuthState } from './actions'

const DEMO_EMAIL = 'kemi@onastudio.example'
const DEMO_PASSWORD = 'owo-demo-2026'

/**
 * Carries ?next=/invoices through the form, so after signing in you land
 * where the proxy stopped you. useSearchParams() reads the URL, so it sits
 * in its own tiny <Suspense>: the rest of the form prerenders as static HTML.
 */
function NextField() {
  const next = useSearchParams().get('next')
  return next ? <input type="hidden" name="next" value={next} /> : null
}

function DemoNotice() {
  return (
    <p className="mb-6 flex gap-2.5 rounded-control bg-accent-soft p-3 text-sm text-ink">
      <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
      <span>
        <strong>Demo login.</strong> The details are filled in; any email with a password of 8+ characters works. This is
        not real authentication.
      </span>
    </p>
  )
}

export function LoginForm() {
  const [state, action] = useActionState<AuthState, FormData>(signIn, {})
  return (
    <>
      <DemoNotice />
      {/* noValidate: the server checks and returns messages tied to each field. */}
      <form action={action} noValidate className="space-y-5">
        <Suspense>
          <NextField />
        </Suspense>
        <Field name="email" label="Email" error={state.errors?.email}>
          {(control) => <Input {...control} type="email" autoComplete="email" defaultValue={state.email ?? DEMO_EMAIL} />}
        </Field>
        <Field name="password" label="Password" error={state.errors?.password} hint={<Link href="/forgot-password" className="font-semibold text-brand hover:underline">Forgot your password?</Link>}>
          {(control) => <Input {...control} type="password" autoComplete="current-password" defaultValue={DEMO_PASSWORD} />}
        </Field>
        <SubmitButton block size="lg">
          Sign in
        </SubmitButton>
      </form>
    </>
  )
}

export function SignupForm() {
  const [state, action] = useActionState<AuthState, FormData>(signUp, {})
  return (
    <>
      <DemoNotice />
      <form action={action} noValidate className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="name" label="Your name" error={state.errors?.name}>
            {(control) => <Input {...control} autoComplete="name" defaultValue="Kémi Adébáyọ̀" />}
          </Field>
          <Field name="business" label="Business name" error={state.errors?.business}>
            {(control) => <Input {...control} autoComplete="organization" defaultValue="Ọnà Design Studio" />}
          </Field>
        </div>
        <Field name="email" label="Work email" error={state.errors?.email}>
          {(control) => <Input {...control} type="email" autoComplete="email" defaultValue={state.email ?? DEMO_EMAIL} />}
        </Field>
        <Field name="password" label="Password" hint="At least 8 characters." error={state.errors?.password}>
          {(control) => <Input {...control} type="password" autoComplete="new-password" defaultValue={DEMO_PASSWORD} />}
        </Field>
        <SubmitButton block size="lg">
          Create account
        </SubmitButton>
      </form>
    </>
  )
}

export function ForgotPasswordForm() {
  const [state, action] = useActionState<AuthState, FormData>(requestPasswordReset, {})
  if (state.sent) {
    return (
      // role="status" announces the confirmation that replaced the form.
      <div role="status" className="flex flex-col items-center py-4 text-center">
        <CheckCircle2 aria-hidden className="size-10 text-paid" />
        <p className="mt-4 font-semibold text-ink">Check your inbox</p>
        <p className="mt-1 text-sm text-muted">
          If an account exists for <strong className="text-ink">{state.email}</strong>, a reset link is on its way. (Demo:
          no email is sent.)
        </p>
        <Link href="/login" className="mt-6 text-sm font-semibold text-brand hover:underline">
          Back to sign in
        </Link>
      </div>
    )
  }
  return (
    <form action={action} noValidate className="space-y-5">
      <Field name="email" label="Email" error={state.errors?.email} hint="We’ll send a link to choose a new password.">
        {(control) => <Input {...control} type="email" autoComplete="email" defaultValue={state.email} />}
      </Field>
      <SubmitButton block size="lg">
        Send reset link
      </SubmitButton>
    </form>
  )
}
