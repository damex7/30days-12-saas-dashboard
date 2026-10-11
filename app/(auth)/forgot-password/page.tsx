import type { Metadata } from 'next'
import Link from 'next/link'
import { ForgotPasswordForm } from '../auth-forms'

export const metadata: Metadata = { title: 'Reset your password' }

export default function ForgotPasswordPage() {
  return (
    <>
      <h1 className="text-2xl font-extrabold text-ink">Forgot your password?</h1>
      <p className="mt-1 mb-6 text-muted">Enter your email and we’ll send you a reset link.</p>
      <ForgotPasswordForm />
      <p className="mt-6 text-center text-sm text-muted">
        Remembered it?{' '}
        <Link href="/login" className="font-semibold text-brand hover:underline">
          Sign in
        </Link>
      </p>
    </>
  )
}
