import type { Metadata } from 'next'
import Link from 'next/link'
import { SignupForm } from '../auth-forms'

export const metadata: Metadata = { title: 'Create your account' }

export default function SignupPage() {
  return (
    <>
      <h1 className="text-2xl font-extrabold text-ink">Start invoicing for free</h1>
      <p className="mt-1 mb-6 text-muted">Five free invoices every month. No card needed.</p>
      <SignupForm />
      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-brand hover:underline">
          Sign in
        </Link>
      </p>
    </>
  )
}
