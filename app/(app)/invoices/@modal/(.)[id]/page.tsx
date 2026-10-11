import { FileText } from 'lucide-react'
import { InvoiceSummary } from '@/components/app/invoice-document'
import { InvoiceModal } from '@/components/app/invoice-modal'
import { WhatsAppShareLink } from '@/components/app/whatsapp-link'
import { buttonVariants } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { getInvoice } from '@/lib/data'

// THE INTERCEPTING ROUTE: app/(app)/invoices/@modal/(.)[id]/page.tsx
//
// Runs instead of invoices/[id]/page.tsx when you click an invoice while
// already on /invoices. It renders into the @modal slot, so the list stays
// visible (and keeps its scroll position and filters) underneath.

export default async function InvoiceQuickView({ params }: PageProps<'/invoices/[id]'>) {
  const { id } = await params
  const invoice = await getInvoice(id)

  if (!invoice) {
    return (
      <InvoiceModal title="Invoice not found">
        <EmptyState icon={<FileText />} title={`There’s no invoice called ${id}`} description="It may have been deleted." />
      </InvoiceModal>
    )
  }

  return (
    <InvoiceModal
      title={`Invoice ${invoice.id}`}
      footer={
        <>
          <WhatsAppShareLink invoice={invoice} />
          {/* A plain <a>, NOT <Link>: a client-side navigation to this URL
              would just be intercepted again and re-open the modal. A full
              page load skips interception and renders invoices/[id]. */}
          <a href={`/invoices/${invoice.id}`} className={buttonVariants({ variant: 'primary' })}>
            Open full invoice
          </a>
        </>
      }
    >
      <InvoiceSummary invoice={invoice} />
    </InvoiceModal>
  )
}
