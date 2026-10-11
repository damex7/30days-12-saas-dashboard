import { Mail, MapPin, MessageCircle } from 'lucide-react'
import type { Metadata } from 'next'
import { Container } from '@/components/layout/container'
import { PageIntro } from '@/components/marketing/page-intro'
import { Card } from '@/components/ui/card'
import { ContactForm } from './contact-form'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Questions about Owó? Send us a message.',
}

const ways = [
  { icon: MessageCircle, title: 'WhatsApp', body: 'Fastest for quick questions, Monday to Saturday.' },
  { icon: Mail, title: 'Email', body: 'hello@owo.example: we reply within one working day.' },
  { icon: MapPin, title: 'Office', body: 'Yaba, Lagos (by appointment).' },
]

export default function ContactPage() {
  return (
    <>
      <PageIntro eyebrow="Contact" title="Talk to a person" description="Questions about plans, VAT or moving from spreadsheets? We’re happy to help." />
      <Container className="grid gap-10 py-16 lg:grid-cols-[1fr_1.4fr]">
        <ul className="space-y-6">
          {ways.map((w) => (
            <li key={w.title} className="flex gap-4">
              <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-card bg-brand-soft text-brand">
                <w.icon className="size-5" />
              </span>
              <div>
                <h2 className="font-sans text-base font-bold tracking-normal text-ink">{w.title}</h2>
                <p className="text-sm text-muted">{w.body}</p>
              </div>
            </li>
          ))}
        </ul>
        <Card className="p-6 sm:p-8">
          <ContactForm />
        </Card>
      </Container>
    </>
  )
}
