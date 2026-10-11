// SAMPLE CONTENT for the marketing site: plans, FAQ, testimonials, features
// and the changelog. The people and businesses quoted are FICTIONAL.

import type { ChangelogEntry, ComparisonRow, Faq, Feature, Plan, Testimonial } from '@/lib/types'

export const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    blurb: 'For your first clients and side gigs.',
    monthly: 0,
    yearly: 0,
    highlights: ['5 invoices a month', 'Up to 3 clients', 'Naira invoices with VAT', 'Share by link or WhatsApp'],
    cta: 'Start free',
  },
  {
    id: 'growth',
    name: 'Growth',
    blurb: 'For full-time freelancers who bill every week.',
    monthly: 750_000,
    yearly: 7_500_000,
    highlights: ['Unlimited invoices and clients', 'Automatic payment reminders', 'Revenue and VAT reports', 'Your logo and brand colours'],
    cta: 'Try Growth free for 14 days',
    featured: true,
  },
  {
    id: 'business',
    name: 'Business',
    blurb: 'For studios and small teams.',
    monthly: 1_800_000,
    yearly: 18_000_000,
    highlights: ['Everything in Growth', 'Up to 5 team members', 'Multiple businesses', 'Priority support on WhatsApp'],
    cta: 'Try Business free',
  },
]

export const comparison: ComparisonRow[] = [
  { feature: 'Invoices per month', values: { free: '5', growth: 'Unlimited', business: 'Unlimited' } },
  { feature: 'Clients', values: { free: '3', growth: 'Unlimited', business: 'Unlimited' } },
  { feature: 'VAT at 7.5%, calculated for you', values: { free: true, growth: true, business: true } },
  { feature: 'Share on WhatsApp and email', values: { free: true, growth: true, business: true } },
  { feature: 'Printable / PDF invoices', values: { free: true, growth: true, business: true } },
  { feature: 'Automatic reminders', values: { free: false, growth: true, business: true } },
  { feature: 'Custom logo and colours', values: { free: false, growth: true, business: true } },
  { feature: 'Revenue and VAT reports', values: { free: false, growth: true, business: true } },
  { feature: 'Team members', values: { free: '1', growth: '1', business: 'Up to 5' } },
  { feature: 'Businesses per account', values: { free: '1', growth: '1', business: '3' } },
  { feature: 'Support', values: { free: 'Email', growth: 'Email', business: 'Priority WhatsApp' } },
]

export const faqs: Faq[] = [
  {
    question: 'Do my clients need an Owó account to pay me?',
    answer:
      'No. Your client gets a link (by WhatsApp or email) to a clean invoice page they can open on any phone, print, or save as a PDF. They pay you by bank transfer as usual.',
  },
  {
    question: 'How does Owó handle VAT?',
    answer:
      'Switch VAT on for an invoice and Owó adds 7.5% to the subtotal and shows it as its own line, so your client sees exactly what they are paying for. Reports add up the VAT you have charged each month.',
  },
  {
    question: 'Can I invoice in dollars?',
    answer: 'Not yet. Owó is built for naira first. Multi-currency invoices are on our roadmap for next year.',
  },
  {
    question: 'What happens when I hit the Free plan limit?',
    answer:
      'Nothing is deleted. You can still view and share existing invoices; you just can’t create a sixth invoice that month until you upgrade or the month rolls over.',
  },
  {
    question: 'Can I cancel any time?',
    answer: 'Yes. Paid plans are month to month (or year to year). Cancel from Settings → Billing and you keep access until the end of the period.',
  },
  {
    question: 'Is my data safe?',
    answer:
      'Your invoices are stored encrypted and backed up daily, and you can export everything at any time. We never sell your data or contact your clients.',
  },
]

export const testimonials: Testimonial[] = [
  {
    quote:
      'I used to send invoices as Word documents and chase people for weeks. Now the reminders do the chasing and I get paid while I’m on the next job.',
    name: 'Amaka Nwachukwu',
    role: 'Brand designer',
    business: 'Amaka Studio',
    city: 'Lagos',
    result: 'Paid 11 days faster',
  },
  {
    quote:
      'My clients are on WhatsApp all day. Sending the invoice there, with the total and a link, means it actually gets opened.',
    name: 'Ibrahim Danladi',
    role: 'Videographer',
    business: 'Sahel Frames',
    city: 'Kano',
    result: '3× more invoices opened',
  },
  {
    quote: 'VAT used to be a spreadsheet I dreaded every month. Owó adds it up for me and the numbers just match.',
    name: 'Tọ́pẹ́ Adéwálé',
    role: 'Founder',
    business: 'Àṣà Events',
    city: 'Ibadan',
    result: 'VAT returns in 10 minutes',
  },
  {
    quote: 'We’re three people and everyone can see what’s outstanding. No more “did anyone send Garden City their invoice?”',
    name: 'Ebiere Alagoa',
    role: 'Operations lead',
    business: 'Creek Media',
    city: 'Port Harcourt',
    result: 'Zero missed invoices',
  },
]

export const features: Feature[] = [
  { icon: 'receipt', title: 'Invoices in under a minute', body: 'Pick a client, add line items, and Owó does the maths: subtotal, 7.5% VAT and total, in naira, to the kobo.' },
  { icon: 'whatsapp', title: 'Share on WhatsApp', body: 'Send a tidy invoice link where your clients actually read messages, with the amount and due date in the preview.' },
  { icon: 'bell', title: 'Reminders that chase for you', body: 'Polite, automatic follow-ups 3 and 10 days after the due date, so you never have to send the awkward message.' },
  { icon: 'chart', title: 'Know where you stand', body: 'Revenue this month, what’s outstanding and who’s late, on one screen, every morning.' },
  { icon: 'printer', title: 'Print-perfect', body: 'Every invoice has a clean printable layout. Save it as a PDF from any browser for your records.' },
  { icon: 'users', title: 'Built for small teams', body: 'Invite your accountant or a partner, and keep every client and invoice in one shared place.' },
]

export const changelog: ChangelogEntry[] = [
  {
    version: '1.6',
    date: '2026-10-06',
    title: 'Quick view for invoices',
    tag: 'New',
    items: ['Open any invoice in a quick-view panel without leaving the list.', 'Press Esc to close it and land right back where you were.'],
  },
  {
    version: '1.5',
    date: '2026-09-18',
    title: 'Faster dashboard',
    tag: 'Improved',
    items: ['Dashboard panels now load independently, so one slow report never holds up the rest.', 'Revenue chart shows 12 months at a glance.'],
  },
  {
    version: '1.4',
    date: '2026-08-29',
    title: 'Share on WhatsApp',
    tag: 'New',
    items: ['Every invoice has a “Share on WhatsApp” button with the amount and due date pre-filled.'],
  },
  {
    version: '1.3',
    date: '2026-08-02',
    title: 'Dark mode',
    tag: 'New',
    items: ['Owó follows your phone’s light or dark setting, or you can choose one in the menu.'],
  },
  {
    version: '1.2.1',
    date: '2026-07-15',
    title: 'VAT rounding fix',
    tag: 'Fixed',
    items: ['VAT is now rounded once on the subtotal, matching how FIRS expects it to be shown.'],
  },
]

/** Wordmarks for the "trusted by" strip: fictional businesses, set in type. */
export const logoWordmarks = ['Ankara Atelier', 'Coal City Coffee', 'Danfo Digital', 'Ìtàn Books', 'Delta Sun', 'Owambe Rentals']
