import { ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/layout/page-header'
import { getClientOptions } from '@/lib/data'
import { todayInLagos } from '@/lib/dates'
import { InvoiceForm } from './invoice-form'

export const metadata: Metadata = { title: 'New invoice' }

// A Server Component page that hands data (the client list, today's date)
// to a Client Component form. The page fetches; the form handles typing.
// "new" is a static segment, so it wins over invoices/[id]: this page is
// never mistaken for an invoice called "new".
export default async function NewInvoicePage() {
  const clients = await getClientOptions()
  return (
    <>
      <PageHeader
        breadcrumb={
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5">
              <li>
                <Link href="/invoices" className="hover:text-ink hover:underline">
                  Invoices
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="size-3.5" />
              </li>
              <li aria-current="page" className="text-ink">
                New
              </li>
            </ol>
          </nav>
        }
        title="New invoice"
        description="Add what you did; Owó works out VAT and the total."
      />
      <InvoiceForm clients={clients} today={todayInLagos()} />
    </>
  )
}
