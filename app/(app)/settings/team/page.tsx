import type { Metadata } from 'next'
import { DemoForm } from '@/components/app/demo-form'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { Field } from '@/components/ui/field'
import { Input, Select } from '@/components/ui/form-controls'
import { getBusiness } from '@/lib/data'

export const metadata: Metadata = { title: 'Team' }

export default async function TeamSettings() {
  const business = await getBusiness()
  // Sample team members (fictional).
  const members = [
    { name: business.ownerName, email: business.email, role: 'Owner' },
    { name: 'Tunde Afolabi', email: 'tunde@onastudio.example', role: 'Accountant' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader title="Team members" description="Your plan includes 1 seat. Business includes up to 5." />
        <CardBody>
          <ul className="divide-y divide-line">
            {members.map((m) => (
              <li key={m.email} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <Avatar name={m.name} decorative />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-ink">{m.name}</p>
                  <p className="truncate text-sm text-muted">{m.email}</p>
                </div>
                <Badge tone={m.role === 'Owner' ? 'brand' : 'neutral'}>{m.role}</Badge>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Invite someone" description="They’ll get an email with a link to join." />
        <DemoForm savedMessage="Invitation sent" submitLabel="Send invite">
          <CardBody className="grid gap-5 sm:grid-cols-[1fr_12rem]">
            <Field name="inviteEmail" label="Email address">
              {(control) => <Input {...control} type="email" placeholder="name@example.com" />}
            </Field>
            <Field name="inviteRole" label="Role">
              {(control) => (
                <Select {...control} defaultValue="member">
                  <option value="member">Member</option>
                  <option value="accountant">Accountant (read-only)</option>
                  <option value="admin">Admin</option>
                </Select>
              )}
            </Field>
          </CardBody>
        </DemoForm>
      </Card>
    </div>
  )
}
