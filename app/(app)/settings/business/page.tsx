import type { Metadata } from 'next'
import { DemoForm } from '@/components/app/demo-form'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { Field } from '@/components/ui/field'
import { Input, Select, Switch } from '@/components/ui/form-controls'
import { getBusiness } from '@/lib/data'

export const metadata: Metadata = { title: 'Business' }

export default async function BusinessSettings() {
  const business = await getBusiness()
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader title="Business details" description="Printed at the top of every invoice." />
        <DemoForm savedMessage="Business details saved">
          <CardBody className="grid gap-5 sm:grid-cols-2">
            <Field name="businessName" label="Business name" className="sm:col-span-2">
              {(control) => <Input {...control} autoComplete="organization" defaultValue={business.name} />}
            </Field>
            <Field name="address" label="Street address" className="sm:col-span-2">
              {(control) => <Input {...control} autoComplete="street-address" defaultValue={business.address} />}
            </Field>
            <Field name="city" label="City">
              {(control) => <Input {...control} autoComplete="address-level2" defaultValue={business.city} />}
            </Field>
            <Field name="state" label="State">
              {(control) => <Input {...control} autoComplete="address-level1" defaultValue={business.state} />}
            </Field>
            <Field name="tin" label="Tax ID (TIN)" hint="Shown on invoices that include VAT.">
              {(control) => <Input {...control} defaultValue={business.tin} />}
            </Field>
            <Field name="terms" label="Default payment terms">
              {(control) => (
                <Select {...control} defaultValue={String(business.paymentTermsDays)}>
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                </Select>
              )}
            </Field>
            <div className="sm:col-span-2">
              <Switch id="default-vat" name="defaultVat" defaultChecked label="Add VAT (7.5%) to new invoices" description="You can still switch it off per invoice." />
            </div>
          </CardBody>
        </DemoForm>
      </Card>

      <Card>
        <CardHeader title="Bank account" description="Clients see this so they can pay by transfer." />
        <DemoForm savedMessage="Bank details saved">
          <CardBody className="grid gap-5 sm:grid-cols-2">
            <Field name="bankName" label="Bank">
              {(control) => <Input {...control} defaultValue={business.bank.name} />}
            </Field>
            <Field name="accountNumber" label="Account number" hint="10 digits (NUBAN).">
              {(control) => <Input {...control} inputMode="numeric" maxLength={10} defaultValue={business.bank.accountNumber} className="font-mono" />}
            </Field>
            <Field name="accountName" label="Account name" className="sm:col-span-2">
              {(control) => <Input {...control} defaultValue={business.bank.accountName} />}
            </Field>
          </CardBody>
        </DemoForm>
      </Card>
    </div>
  )
}
