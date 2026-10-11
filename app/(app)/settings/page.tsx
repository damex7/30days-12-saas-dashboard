import { redirect } from 'next/navigation'

// /settings on its own has no content: send people to the first tab.
// redirect() in a Server Component responds before anything renders.
export default function SettingsIndex() {
  redirect('/settings/profile')
}
