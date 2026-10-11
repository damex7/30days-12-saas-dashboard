import { BarChart3, FileText, LayoutDashboard, Settings, Users, type LucideIcon } from 'lucide-react'

/** The app's main navigation, shared by the desktop sidebar and the phone drawer. */
export const appNavItems: { href: string; label: string; icon: LucideIcon }[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/invoices', label: 'Invoices', icon: FileText },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export const SIDEBAR_STORAGE_KEY = 'owo-sidebar'

/**
 * Runs before first paint (from app/(app)/layout.tsx) so a collapsed
 * sidebar is collapsed from the very first frame, with no jump. The same
 * trick as the theme script, but it lives in the app layout because only
 * the app has a sidebar.
 */
export const sidebarScript = `(function(){try{if(localStorage.getItem(${JSON.stringify(SIDEBAR_STORAGE_KEY)})==='collapsed')document.documentElement.dataset.sidebar='collapsed'}catch(e){}})()`
