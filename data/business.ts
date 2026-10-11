// SAMPLE CONTENT: a fictional business used as the signed-in demo account.
import type { Business } from '@/lib/types'

export const business: Business = {
  name: 'Ọnà Design Studio',
  ownerName: 'Kémi Adébáyọ̀',
  ownerRole: 'Founder & creative director',
  email: 'kemi@onastudio.example',
  phone: '+234 801 234 5678',
  address: '14 Ajose Adeogun Street, Victoria Island',
  city: 'Lagos',
  state: 'Lagos',
  tin: '21998877-0001',
  bank: { name: 'Example Bank', accountName: 'Ọnà Design Studio', accountNumber: '0123456789' },
  plan: 'growth',
  paymentTermsDays: 14,
}
