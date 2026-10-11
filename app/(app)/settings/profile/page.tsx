import type { Metadata } from 'next'
import { DemoForm } from '@/components/app/demo-form'
import { Avatar } from '@/components/ui/avatar'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { Field } from '@/components/ui/field'
import { Checkbox, Input } from '@/components/ui/form-controls'
import { getBusiness } from '@/lib/data'

// Fills the settings layout's template: "Profile · Settings · Owó".
export const metadata: Metadata = { title: 'Profile' }

export default async function ProfileSettings() {
  const business = await getBusiness()
  return (
    <Card>
      <CardHeader title="Your profile" description="How you appear on invoices and to your team." />
      <DemoForm savedMessage="Profile saved">
        <CardBody className="grid gap-5 sm:grid-cols-2">
          <div className="flex items-center gap-4 sm:col-span-2">
            <Avatar name={business.ownerName} size="lg" decorative />
            <p className="text-sm text-muted">Your initials are used as your picture. Photo uploads arrive with accounts on Day 16.</p>
          </div>
          <Field name="ownerName" label="Full name">
            {(control) => <Input {...control} autoComplete="name" defaultValue={business.ownerName} />}
          </Field>
          <Field name="ownerRole" label="Role">
            {(control) => <Input {...control} autoComplete="organization-title" defaultValue={business.ownerRole} />}
          </Field>
          <Field name="email" label="Email" hint="Where payment notifications go.">
            {(control) => <Input {...control} type="email" autoComplete="email" defaultValue={business.email} />}
          </Field>
          <Field name="phone" label="Phone">
            {(control) => <Input {...control} type="tel" autoComplete="tel" defaultValue={business.phone} />}
          </Field>
          <fieldset className="sm:col-span-2">
            <legend className="mb-3 text-sm font-semibold text-ink">Email me when</legend>
            <div className="space-y-3">
              <Checkbox id="notify-paid" name="notifyPaid" defaultChecked label="An invoice is paid" />
              <Checkbox id="notify-viewed" name="notifyViewed" defaultChecked label="A client opens an invoice" />
              <Checkbox id="notify-weekly" name="notifyWeekly" label="Weekly summary" description="Every Monday morning: what came in and what’s still outstanding." />
            </div>
          </fieldset>
        </CardBody>
      </DemoForm>
    </Card>
  )
}
