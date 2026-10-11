import { ChevronRight, FileText, Mail, Phone, Plus, Wallet } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { InvoiceTable } from '@/components/app/invoice-table'
import { StatCard } from '@/components/app/stat-card'
import { PageHeader } from '@/components/layout/page-header'
import { Avatar } from '@/components/ui/avatar'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { getClient } from '@/lib/data'
import { formatDate } from '@/lib/dates'
import { formatNaira } from '@/lib/money'

export async function generateMetadata({ params }: PageProps<'/clients/[id]'>): Promise<Metadata> {
  const data = await getClient((await params).id)
  return { title: data?.client.name ?? 'Client not found' }
}

// A detail page assembled from the same pieces as everything else:
// PageHeader (with breadcrumb and actions slots), StatCard, Card and the
// InvoiceTable, here without its client column or sorting.
export default async function ClientPage({ params }: PageProps<'/clients/[id]'>) {
  const { id } = await params
  const data = await getClient(id)
  if (!data) notFound()
  const { client, invoices } = data

  return (
    <>
      <PageHeader
        breadcrumb={
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5">
              <li>
                <Link href="/clients" className="hover:text-ink hover:underline">
                  Clients
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="size-3.5" />
              </li>
              <li aria-current="page" className="text-ink">
                {client.name}
              </li>
            </ol>
          </nav>
        }
        title={
          <span className="flex items-center gap-3">
            <Avatar name={client.name} size="lg" decorative />
            {client.name}
          </span>
        }
        description={`${client.industry} · ${client.city}, ${client.state} · client since ${formatDate(client.since)}`}
        actions={
          <>
            {/* A mailto: isn't a page, so it's a plain <a> styled with buttonVariants. */}
            <a href={`mailto:${client.email}`} className={buttonVariants({ variant: 'secondary' })}>
              <Mail aria-hidden /> Email
            </a>
            <Button href="/invoices/new">
              <Plus aria-hidden /> New invoice
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
        <div className="flex min-w-0 flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard label="Billed" value={formatNaira(client.billed)} icon={<Wallet />} hint="All sent invoices" />
            <StatCard label="Outstanding" value={formatNaira(client.outstanding)} icon={<FileText />} hint="Sent, not yet paid" />
            <StatCard label="Invoices" value={client.invoiceCount} icon={<FileText />} hint={client.lastInvoiceDate ? `Last on ${formatDate(client.lastInvoiceDate)}` : 'None yet'} />
          </div>
          <Card>
            <CardHeader title="Invoices" className="pb-4" />
            <InvoiceTable invoices={invoices} showClient={false} caption={`Invoices for ${client.name}`} />
          </Card>
        </div>

        <Card as="section" aria-labelledby="contact-title" className="h-fit">
          <CardHeader title="Contact" id="contact-title" />
          <CardBody>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-muted">Contact person</dt>
                <dd className="font-semibold text-ink">{client.contactName}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-muted">
                  <Mail aria-hidden className="size-3.5" /> Email
                </dt>
                <dd className="break-all text-ink">{client.email}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-muted">
                  <Phone aria-hidden className="size-3.5" /> Phone
                </dt>
                <dd className="text-ink">{client.phone}</dd>
              </div>
            </dl>
            <p className="mt-5 text-xs text-subtle">Sample client: the name and details are made up.</p>
          </CardBody>
        </Card>
      </div>
    </>
  )
}
