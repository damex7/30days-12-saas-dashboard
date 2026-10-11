import { ArrowRight, BellRing, FilePlus2, Send } from 'lucide-react'
import { Container, Section } from '@/components/layout/container'
import { CtaBand } from '@/components/marketing/cta-band'
import { Faq } from '@/components/marketing/faq'
import { FeatureGrid } from '@/components/marketing/feature-grid'
import { PricingCard } from '@/components/marketing/pricing-card'
import { ProductShowcase } from '@/components/marketing/product-showcase'
import { Testimonial } from '@/components/marketing/testimonial'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getFaqs, getFeatures, getLogoWordmarks, getPlans, getTestimonials } from '@/lib/data'

// No `metadata` export: the home page uses the root layout's `title.default`.

const steps = [
  { icon: FilePlus2, title: 'Create the invoice', body: 'Choose a client, add what you did and Owó adds 7.5% VAT and the total, to the kobo.' },
  { icon: Send, title: 'Send it where they’ll see it', body: 'Share a link on WhatsApp or by email. Your client opens a clean invoice on any phone.' },
  { icon: BellRing, title: 'Let Owó chase it', body: 'Polite reminders go out after the due date until it’s paid, then it’s marked paid on your dashboard.' },
]

export default async function HomePage() {
  // Each of these is a 'use cache' function, so this page is prerendered
  // into static HTML at build time.
  const [features, testimonials, plans, faqs, logos] = await Promise.all([
    getFeatures(),
    getTestimonials(),
    getPlans(),
    getFaqs(),
    getLogoWordmarks(),
  ])

  return (
    <>
      {/* HERO */}
      <section aria-labelledby="hero-heading" className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[38rem] bg-[radial-gradient(60rem_30rem_at_70%_-10%,var(--color-brand-soft),transparent_70%)]" />
        <Container className="grid grid-cols-1 items-center gap-12 pt-14 pb-16 sm:pt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-10 lg:pb-24">
          <div className="animate-rise">
            <Badge tone="accent" className="mb-5">
              New: quick view for invoices
            </Badge>
            <h1 id="hero-heading" className="text-4xl leading-[1.05] font-extrabold text-ink sm:text-5xl lg:text-6xl">
              Send the invoice. <span className="text-brand">Get paid.</span> Get on with your day.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted">
              Owó is invoicing for Nigerian freelancers and small businesses. Professional invoices in naira, VAT done for you,
              shared on WhatsApp, and reminders that chase late payers so you don’t have to.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/signup" size="lg">
                Start free <ArrowRight aria-hidden />
              </Button>
              <Button href="/pricing" size="lg" variant="secondary">
                See pricing
              </Button>
            </div>
            <p className="mt-4 text-sm text-subtle">Free for your first 5 invoices a month. No card needed.</p>
          </div>
          <ProductShowcase />
        </Container>
      </section>

      {/* LOGOS: fictional businesses set as wordmarks */}
      <section aria-labelledby="logos-heading" className="border-y border-line bg-sunken py-10">
        <Container>
          <h2 id="logos-heading" className="text-center font-sans text-sm font-semibold tracking-normal text-muted">
            Trusted by freelancers and small businesses from Lagos to Kano
          </h2>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {logos.map((name, i) => (
              <li
                key={name}
                className={i % 2 ? 'font-display text-lg font-extrabold text-subtle' : 'font-mono text-base font-semibold tracking-tight text-subtle uppercase'}
              >
                {name}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Section
        id="features"
        eyebrow="Features"
        title="Everything you need to bill like a business"
        description="No spreadsheets, no Word templates, no awkward “just following up” messages."
      >
        <FeatureGrid features={features} />
      </Section>

      <Section id="how-it-works" tone="sunken" eyebrow="How it works" title="From job done to money in, in three steps">
        <ol className="grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title} className="relative rounded-card border border-line bg-raised p-6 shadow-card">
              <span aria-hidden className="font-display text-5xl font-extrabold text-accent">
                {i + 1}
              </span>
              <step.icon aria-hidden className="absolute top-6 right-6 size-6 text-brand" />
              <h3 className="mt-3 text-lg font-bold text-ink">{step.title}</h3>
              <p className="mt-2 text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="testimonials" eyebrow="Customers" title="Freelancers who stopped chasing payments">
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 3).map((t) => (
            <li key={t.name}>
              <Testimonial testimonial={t} />
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-xs text-subtle">The people and businesses quoted are fictional sample content.</p>
      </Section>

      <Section
        id="pricing"
        tone="sunken"
        eyebrow="Pricing"
        title="Simple pricing in naira"
        description="Start free. Upgrade when Owó is saving you more than it costs."
        actions={
          <Button href="/pricing" variant="secondary">
            Compare all plans <ArrowRight aria-hidden />
          </Button>
        }
      >
        <ul className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <li key={plan.id}>
              <PricingCard
                plan={plan}
                cta={
                  <Button href={`/signup?plan=${plan.id}`} variant={plan.featured ? 'primary' : 'secondary'} block>
                    {plan.cta}
                  </Button>
                }
              />
            </li>
          ))}
        </ul>
      </Section>

      <Section id="faq" eyebrow="FAQ" title="Questions, answered">
        <Faq items={faqs} />
      </Section>

      <CtaBand
        title="Your next invoice could be paid this week"
        description="Set up in two minutes. Your first five invoices every month are free."
        actions={
          <>
            <Button href="/signup" size="lg" className="bg-accent text-accent-ink hover:bg-accent/90">
              Start free
            </Button>
            <Button href="/contact" size="lg" variant="ghost" className="text-brand-ink hover:bg-brand-ink/10">
              Talk to us
            </Button>
          </>
        }
      />
    </>
  )
}
