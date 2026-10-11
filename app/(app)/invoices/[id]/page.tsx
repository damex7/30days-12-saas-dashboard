import { ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { InvoiceDocument } from '@/components/app/invoice-document'
import { PrintButton } from '@/components/app/print-button'
import { WhatsAppShareLink } from '@/components/app/whatsapp-link'
import { PageHeader } from '@/components/layout/page-header'
import { InvoiceStatusBadge } from '@/components/ui/badge'
import { ToastOnMount } from '@/components/ui/toast'
import { getBusiness, getInvoice } from '@/lib/data'
import { first } from '@/lib/url'

// DYNAMIC METADATA: the title comes from the URL, so it's generated per
// request. "INV-0042" fills the root template → "INV-0042 · Owó".
export async function generateMetadata({ params }: PageProps<'/invoices/[id]'>): Promise<Metadata> {
  const { id } = await params
  return { title: id.toUpperCase() }
}

// THE FULL INVOICE PAGE. Shown on a direct visit or refresh of
// /invoices/INV-0042, or when arriving from outside the list (the
// dashboard, a notification). Clicking an invoice IN the list shows the
// intercepted modal instead (see invoices/layout.tsx).
export default async function InvoicePage({ params, searchParams }: PageProps<'/invoices/[id]'>) {
  // params and searchParams are both Promises: await them together.
  const [{ id }, query] = await Promise.all([params, searchParams])
  const [invoice, business] = await Promise.all([getInvoice(id), getBusiness()])
  // Renders the nearest not-found.tsx (invoices/[id]/not-found.tsx).
  if (!invoice) notFound()

  return (
    <>
      {/* Arriving from the new-invoice form: confirm with a toast. */}
      {first(query.created) && <ToastOnMount title={`Invoice ${invoice.id} created`} description="It’s ready to share." />}
      <PageHeader
        className="print:hidden"
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
              <li aria-current="page" className="font-mono text-ink">
                {invoice.id}
              </li>
            </ol>
          </nav>
        }
        title={
          <span className="flex flex-wrap items-center gap-3">
            <span className="font-mono">{invoice.id}</span>
            <InvoiceStatusBadge status={invoice.status} />
          </span>
        }
        description={`${invoice.client.name} · ${invoice.items.length} item${invoice.items.length === 1 ? '' : 's'}`}
        actions={
          <>
            <WhatsAppShareLink invoice={invoice} kind={invoice.status === 'overdue' ? 'reminder' : 'share'} />
            <PrintButton />
          </>
        }
      />
      <InvoiceDocument invoice={invoice} business={business} className="mx-auto max-w-4xl" />
    </>
  )
}
