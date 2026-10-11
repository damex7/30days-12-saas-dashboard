import { FileX2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'

// NOT FOUND for /invoices/[id]: rendered when the page calls notFound().
// Because it lives inside the (app) layout, the sidebar and top bar stay,
// and the message can be specific ("invoice", not just "page").
export default function InvoiceNotFound() {
  return (
    <Card>
      <EmptyState
        icon={<FileX2 />}
        title="We couldn’t find that invoice"
        description="Check the invoice number, or find it in the list."
        action={
          <>
            <Button href="/invoices">All invoices</Button>
            <Button href="/invoices/new" variant="secondary">
              New invoice
            </Button>
          </>
        }
      />
    </Card>
  )
}
