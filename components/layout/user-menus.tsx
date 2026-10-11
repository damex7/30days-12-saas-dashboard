import { Bell, Building2, CheckCircle2, CreditCard, Eye, Globe, LogOut, Send, UserRound } from 'lucide-react'
import { signOut } from '@/app/(auth)/actions'
import { Avatar } from '@/components/ui/avatar'
import { DropdownMenu, MenuItem, MenuLabel, MenuSeparator } from '@/components/ui/dropdown-menu'
import { getBusiness, getNotifications } from '@/lib/data'
import { formatRelative } from '@/lib/dates'
import { formatNaira } from '@/lib/money'
import type { ActivityType } from '@/lib/types'

/*
 * These are SERVER Components that render CLIENT Components.
 * They fetch their data on the server, then hand plain props and children
 * to <DropdownMenu> (client), which only adds the open/close and keyboard
 * behaviour. The signOut Server Action is passed straight to a MenuItem:
 * Server Actions are the one kind of function you CAN pass from server to
 * client, because React sends a reference to call, not the code.
 */

const triggerClass =
  'relative grid size-10 place-items-center rounded-control text-muted transition-colors hover:bg-sunken hover:text-ink aria-expanded:bg-sunken aria-expanded:text-ink'

export async function UserMenu() {
  const business = await getBusiness()
  return (
    <DropdownMenu
      triggerClassName="flex items-center gap-2 rounded-pill p-0.5 pr-0.5 hover:bg-sunken sm:pr-3 aria-expanded:bg-sunken"
      trigger={
        <>
          <Avatar name={business.ownerName} decorative />
          <span className="hidden text-left text-sm leading-tight sm:block">
            <span className="block font-semibold text-ink">{business.ownerName}</span>
            <span className="block text-xs text-muted">{business.name}</span>
          </span>
          <span className="sr-only sm:hidden">Account menu for {business.ownerName}</span>
        </>
      }
    >
      <MenuLabel>Signed in as {business.email}</MenuLabel>
      <MenuItem href="/settings/profile">
        <UserRound aria-hidden /> Profile
      </MenuItem>
      <MenuItem href="/settings/business">
        <Building2 aria-hidden /> Business details
      </MenuItem>
      <MenuItem href="/settings/billing">
        <CreditCard aria-hidden /> Billing
      </MenuItem>
      <MenuSeparator />
      <MenuItem href="/">
        <Globe aria-hidden /> Owó website
      </MenuItem>
      <MenuItem action={signOut} tone="danger">
        <LogOut aria-hidden /> Sign out
      </MenuItem>
    </DropdownMenu>
  )
}

const activityIcon: Record<ActivityType, typeof Bell> = {
  paid: CheckCircle2,
  viewed: Eye,
  reminder: Bell,
  sent: Send,
  created: Send,
}

const activityText: Record<ActivityType, string> = {
  paid: 'paid',
  viewed: 'viewed',
  reminder: 'was reminded about',
  sent: 'was sent',
  created: 'created',
}

export async function NotificationsMenu() {
  const { items, today } = await getNotifications()
  const unread = items.filter((n) => n.unread).length
  return (
    <DropdownMenu
      triggerClassName={triggerClass}
      menuClassName="w-[min(22rem,calc(100vw-2rem))]"
      trigger={
        <>
          <Bell aria-hidden className="size-5" />
          {unread > 0 && (
            <span aria-hidden className="absolute top-1.5 right-1.5 grid min-w-4 place-items-center rounded-pill bg-accent px-1 text-[0.625rem] leading-4 font-bold text-accent-ink">
              {unread}
            </span>
          )}
          <span className="sr-only">Notifications{unread ? `, ${unread} new` : ''}</span>
        </>
      }
    >
      <MenuLabel>Notifications</MenuLabel>
      {items.map((n) => {
        const Icon = activityIcon[n.type]
        return (
          <MenuItem key={n.id} href={`/invoices/${n.invoiceId}`} className="items-start">
            <Icon aria-hidden className="mt-0.5" />
            <span className="min-w-0 flex-1">
              <span className="block text-ink">
                <strong className="font-semibold">{n.clientName}</strong> {activityText[n.type]} {n.invoiceId}
              </span>
              <span className="block text-xs text-muted">
                {formatNaira(n.amount)} · {formatRelative(n.date, today)}
              </span>
            </span>
            {n.unread && (
              <span className="mt-1.5 size-2 shrink-0 rounded-pill bg-accent">
                <span className="sr-only">New</span>
              </span>
            )}
          </MenuItem>
        )
      })}
      <MenuSeparator />
      <MenuItem href="/dashboard" className="justify-center font-semibold text-brand">
        View all activity
      </MenuItem>
    </DropdownMenu>
  )
}
