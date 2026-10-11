import { MessageCircle } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import { formatDate } from '@/lib/dates'
import { formatNaira } from '@/lib/money'
import type { InvoiceView } from '@/lib/types'

/**
 * Builds a "click to chat" link. wa.me with only ?text= (no phone number)
 * opens WhatsApp and lets the user pick the contact, so we never hard-code
 * a number (and never message a real person by accident with sample data).
 */
export function whatsappHref(text: string) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}

export function invoiceShareText(invoice: InvoiceView, kind: 'share' | 'reminder', businessName = 'Ọnà Design Studio') {
  const amount = formatNaira(invoice.total)
  return kind === 'share'
    ? `Hello ${invoice.client.contactName.split(' ')[0]}, here is invoice ${invoice.id} from ${businessName} for ${amount}, due ${formatDate(invoice.dueDate)}. Thank you!`
    : `Hello ${invoice.client.contactName.split(' ')[0]}, a friendly reminder that invoice ${invoice.id} for ${amount} was due on ${formatDate(invoice.dueDate)}. Please let me know once it’s paid. Thank you!`
}

/** A button-styled link that opens WhatsApp with the message ready to send. */
export function WhatsAppShareLink({
  invoice,
  kind = 'share',
  size = 'md',
  label,
  className,
}: {
  invoice: InvoiceView
  kind?: 'share' | 'reminder'
  size?: 'sm' | 'md'
  label?: string
  className?: string
}) {
  return (
    <a
      href={whatsappHref(invoiceShareText(invoice, kind))}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(buttonVariants({ variant: 'secondary', size }), className)}
    >
      <MessageCircle aria-hidden />
      {label ?? (kind === 'share' ? 'Share on WhatsApp' : 'Chase on WhatsApp')}
      <span className="sr-only">(opens WhatsApp in a new tab)</span>
    </a>
  )
}
