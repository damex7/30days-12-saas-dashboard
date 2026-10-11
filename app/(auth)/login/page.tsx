import type { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from '../auth-forms'

export const metadata: Metadata = { title: 'Sign in' }

export default function LoginPage() {
  return (
    <>
      <h1 className="text-2xl font-extrabold text-ink">Welcome back</h1>
      <p className="mt-1 mb-6 text-muted">Sign in to see who owes you what.</p>
      <LoginForm />
      <p className="mt-6 text-center text-sm text-muted">
        New to Owó?{' '}
        <Link href="/signup" className="font-semibold text-brand hover:underline">
          Create an account
        </Link>
      </p>
    </>
  )
}
