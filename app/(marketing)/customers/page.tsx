import type { Metadata } from 'next'
import { Container, Section } from '@/components/layout/container'
import { CtaBand } from '@/components/marketing/cta-band'
import { PageIntro } from '@/components/marketing/page-intro'
import { Testimonial } from '@/components/marketing/testimonial'
import { Button } from '@/components/ui/button'
import { getTestimonials } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Customers',
  description: 'How Nigerian freelancers and small businesses use Owó to get paid faster. (Sample stories.)',
}

const numbers = [
  { value: '11 days', label: 'faster payment, on average' },
  { value: '3×', label: 'more invoices opened via WhatsApp' },
  { value: '36', label: 'states and the FCT' },
]

export default async function CustomersPage() {
  const [featured, ...rest] = await getTestimonials()
  return (
    <>
      <PageIntro
        eyebrow="Customers"
        title="Freelancers and small teams getting paid on time"
        description="Designers, videographers, event planners and studios across Nigeria. These are sample stories written for this demo."
      />

      <Container className="py-16">
        {/* The same Testimonial component, in its large variant. */}
        <div className="mx-auto max-w-3xl">
          <Testimonial testimonial={featured} size="lg" showResult />
        </div>
        <dl className="mx-auto mt-12 grid max-w-3xl gap-6 text-center sm:grid-cols-3">
          {numbers.map((n) => (
            <div key={n.label} className="flex flex-col rounded-card border border-line bg-raised p-5 shadow-card">
              <dt className="order-2 mt-1 text-sm text-muted">{n.label}</dt>
              <dd className="font-display text-3xl font-extrabold text-brand">{n.value}</dd>
            </div>
          ))}
        </dl>
      </Container>

      <Section tone="sunken" title="More stories">
        <ul className="grid gap-6 md:grid-cols-3">
          {rest.map((t) => (
            <li key={t.name}>
              <Testimonial testimonial={t} showResult />
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-xs text-subtle">All people, businesses and figures on this page are fictional sample content.</p>
      </Section>

      <CtaBand
        title="Write the next story"
        actions={
          <Button href="/signup" size="lg" className="bg-accent text-accent-ink hover:bg-accent/90">
            Start free
          </Button>
        }
      />
    </>
  )
}
