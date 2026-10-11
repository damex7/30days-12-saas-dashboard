// Facts about the product used in metadata, the header, the footer and emails.

export const site = {
  name: 'Owó',
  tagline: 'Invoices that get you paid',
  description:
    'Owó is invoicing for Nigerian freelancers and small businesses: professional invoices in naira, VAT done for you, and reminders that chase late payers so you don’t have to.',
}

// On Vercel this is the production domain; locally it's the dev server.
export const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000'
