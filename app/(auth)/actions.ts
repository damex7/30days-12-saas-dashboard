'use server'
// SERVER ACTIONS for the auth screens. 'use server' at the top makes every
// export a function the browser can call through a <form action={…}>,
// while the code itself only ever runs on the server.
//
// ⚠️ NOT REAL AUTH: see lib/demo-auth.ts. No password is checked against
// anything; a well-formed email and an 8+ character password "sign in".

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { DEMO_COOKIE, safeNext } from '@/lib/demo-auth'

export type AuthState = {
  errors?: Partial<Record<'name' | 'business' | 'email' | 'password', string>>
  /** Echo the email back so the field isn't wiped after an error. */
  email?: string
  sent?: boolean
}

const EMAIL = /^\S+@\S+\.\S+$/

function checkCredentials(form: FormData) {
  const email = String(form.get('email') ?? '').trim()
  const password = String(form.get('password') ?? '')
  const errors: AuthState['errors'] = {}
  if (!email) errors.email = 'Enter your email address.'
  else if (!EMAIL.test(email)) errors.email = 'That email doesn’t look right. Check for a typo.'
  if (password.length < 8) errors.password = 'Your password needs at least 8 characters.'
  return { email, errors }
}

async function startDemoSession(next: unknown): Promise<never> {
  const jar = await cookies()
  jar.set(DEMO_COOKIE, '1', {
    httpOnly: true, // not readable from page JavaScript
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // a week
  })
  redirect(safeNext(next))
}

export async function signIn(_prev: AuthState, form: FormData): Promise<AuthState> {
  const { email, errors } = checkCredentials(form)
  if (Object.keys(errors).length) return { errors, email }
  return startDemoSession(form.get('next'))
}

export async function signUp(_prev: AuthState, form: FormData): Promise<AuthState> {
  const { email, errors } = checkCredentials(form)
  if (!String(form.get('name') ?? '').trim()) errors.name = 'Tell us your name.'
  if (!String(form.get('business') ?? '').trim()) errors.business = 'Add your business name (you can change it later).'
  if (Object.keys(errors).length) return { errors, email }
  return startDemoSession('/dashboard')
}

export async function requestPasswordReset(_prev: AuthState, form: FormData): Promise<AuthState> {
  const email = String(form.get('email') ?? '').trim()
  if (!EMAIL.test(email)) return { errors: { email: 'Enter the email you signed up with.' }, email }
  // A real app would email a one-time link. We only pretend.
  await new Promise((r) => setTimeout(r, 600))
  return { sent: true, email }
}

export async function signOut() {
  const jar = await cookies()
  jar.delete(DEMO_COOKIE)
  redirect('/login')
}
