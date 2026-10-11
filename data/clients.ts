// SAMPLE CONTENT: 25 fictional clients across Nigerian cities. Any likeness
// to a real business is a coincidence. Emails use the reserved .example domain.
import type { Client } from '@/lib/types'

type Row = [name: string, contact: string, city: string, state: string, industry: string, since: string]

const rows: Row[] = [
  ['Mama Put Kitchens', 'Ngozi Okafor', 'Lagos', 'Lagos', 'Food & drink', '2024-03-12'],
  ['Ìrìnàjò Travels', 'Bayo Ogunleye', 'Ibadan', 'Oyo', 'Travel', '2024-05-02'],
  ['Zobo & Co.', 'Aisha Bello', 'Abuja', 'FCT', 'Food & drink', '2024-06-19'],
  ['Kano Leatherworks', 'Musa Abdullahi', 'Kano', 'Kano', 'Fashion', '2024-07-08'],
  ['Coal City Coffee', 'Chidi Nwosu', 'Enugu', 'Enugu', 'Hospitality', '2024-08-21'],
  ['Garden City Logistics', 'Tamuno Briggs', 'Port Harcourt', 'Rivers', 'Logistics', '2024-09-03'],
  ['Ọjà Fresh Market', 'Funmi Alabi', 'Lagos', 'Lagos', 'Retail', '2024-09-27'],
  ['Jabi Lake Realty', 'Emeka Obi', 'Abuja', 'FCT', 'Real estate', '2024-10-15'],
  ['Bronze Gate Gallery', 'Osaze Igbinedion', 'Benin City', 'Edo', 'Arts', '2024-11-04'],
  ['Calabar Carnival Events', 'Ekaette Bassey', 'Calabar', 'Cross River', 'Events', '2024-11-30'],
  ['Owambe Rentals', 'Yinka Adeyemi', 'Lagos', 'Lagos', 'Events', '2024-12-09'],
  ['Danfo Digital', 'Tobi Akinola', 'Lagos', 'Lagos', 'Technology', '2025-01-14'],
  ['Harmattan Skincare', 'Hauwa Sani', 'Kaduna', 'Kaduna', 'Beauty', '2025-02-06'],
  ['Ankara Atelier', 'Chiamaka Eze', 'Aba', 'Abia', 'Fashion', '2025-02-25'],
  ['Naija Pixel Labs', 'Seun Bakare', 'Lagos', 'Lagos', 'Technology', '2025-03-18'],
  ['Ìtàn Books', 'Dayo Olaniyan', 'Ibadan', 'Oyo', 'Publishing', '2025-04-09'],
  ['Plateau Highlands Tea', 'Danjuma Gyang', 'Jos', 'Plateau', 'Food & drink', '2025-05-01'],
  ['Lekki Fitness Hub', 'Ifeoma Uche', 'Lagos', 'Lagos', 'Health & fitness', '2025-05-22'],
  ['Wazobia Tutors', 'Adaeze Okonkwo', 'Abuja', 'FCT', 'Education', '2025-06-13'],
  ['Agbada & Thread', 'Kunle Bamidele', 'Abeokuta', 'Ogun', 'Fashion', '2025-07-02'],
  ['Delta Sun Solar', 'Ovie Edewor', 'Warri', 'Delta', 'Energy', '2025-07-29'],
  ['Eko Bites', 'Bisi Lawal', 'Lagos', 'Lagos', 'Food & drink', '2025-08-18'],
  ['Ọ̀ṣun Spa & Wellness', 'Ṣadé Ọlá', 'Osogbo', 'Osun', 'Beauty', '2025-09-10'],
  ['Northfield Agro Supplies', 'Ibrahim Yusuf', 'Kaduna', 'Kaduna', 'Agriculture', '2025-10-01'],
  ['Ilorin Clayworks', 'Rukayat Abdulkareem', 'Ilorin', 'Kwara', 'Crafts', '2025-10-24'],
]

/** "Mama Put Kitchens" → "mamaputkitchens" for the example email domain. */
const domain = (name: string) =>
  name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '')

export const clients: Client[] = rows.map(([name, contactName, city, state, industry, since], i) => ({
  id: `cl_${String(i + 1).padStart(2, '0')}`,
  name,
  contactName,
  email: `${domain(contactName.split(' ')[0])}@${domain(name)}.example`,
  phone: `+234 80${(i % 9) + 1} ${String(300 + i * 37).padStart(3, '0')} ${String(1000 + i * 271).slice(-4)}`,
  city,
  state,
  industry,
  since,
}))
