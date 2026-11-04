export type Service = {
  name: string
  description: string
  price: string
  duration: string
}

export type StaffMember = {
  name: string
  role: string
  image: string
}

export type Business = {
  slug: string
  name: string
  category: string
  location: string
  rating: string
  reviews: string
  image: string
  logo: string
  featured: string
  description: string
  phone: string
  email: string
  address: string
  hours: Record<string, string>
  services: Service[]
  staff: StaffMember[]
  reviewHighlights: { name: string; rating: string; text: string }[]
}

export const categories = ['All categories', 'Salons & Haircut', 'Beauty Parlour', 'Restaurants', 'Clinics', 'Consultancy', 'Fitness & Gym'] as const

const salonServices = [
  { name: 'Signature haircut & styling', description: 'A consultation-led cut, wash and finish tailored to your everyday style.', price: 'NPR 1,200', duration: '60 min' },
  { name: 'Balayage refresh', description: 'Soft dimensional colour with a gloss finish and nourishing treatment.', price: 'NPR 5,500', duration: '150 min' },
  { name: 'Express blowout', description: 'A polished, bouncy blow-dry for your next event or everyday reset.', price: 'NPR 900', duration: '45 min' },
]

export const businesses: Business[] = [
  { slug: 'glow-beauty-salon', name: 'Glow Beauty Salon', category: 'Salons & Haircut', location: 'Lalitpur, Nepal', rating: '4.9', reviews: '128', image: '/glow-salon.png', logo: 'G', featured: 'Popular', description: 'Thoughtful hair and beauty appointments in a calm, welcoming space.', phone: '+977 9801234567', email: 'hello@glowbeauty.com', address: 'Jhamsikhel Road, Lalitpur, Nepal', hours: { Monday: '9:00 AM – 7:00 PM', Tuesday: '9:00 AM – 7:00 PM', Wednesday: '9:00 AM – 7:00 PM', Thursday: '9:00 AM – 7:00 PM', Friday: '9:00 AM – 7:00 PM', Saturday: '10:00 AM – 6:00 PM', Sunday: 'Closed' }, services: salonServices, staff: [{ name: 'Maya Shrestha', role: 'Senior stylist', image: '/aura-beauty.png' }, { name: 'Anisha Karki', role: 'Colour specialist', image: '/glow-salon.png' }], reviewHighlights: [{ name: 'Riya B.', rating: '5.0', text: 'The team understood exactly what I wanted. Calm space and beautiful finish.' }, { name: 'Sujan P.', rating: '4.8', text: 'Easy to book and the service was right on time.' }] },
  { slug: 'aura-beauty-parlour', name: 'Aura Beauty Parlour', category: 'Beauty Parlour', location: 'Kathmandu, Nepal', rating: '4.8', reviews: '96', image: '/aura-beauty.png', logo: 'A', featured: 'Top rated', description: 'Personalized beauty care from a friendly team of professionals.', phone: '+977 9812345678', email: 'care@aurabeauty.com', address: 'Lazimpat, Kathmandu, Nepal', hours: { Monday: '10:00 AM – 6:00 PM', Tuesday: '10:00 AM – 6:00 PM', Wednesday: '10:00 AM – 6:00 PM', Thursday: '10:00 AM – 6:00 PM', Friday: '10:00 AM – 6:00 PM', Saturday: '10:00 AM – 5:00 PM', Sunday: 'Closed' }, services: [{ name: 'Bridal beauty consultation', description: 'A personal plan for your wedding looks, trials and day-of schedule.', price: 'NPR 2,000', duration: '60 min' }, { name: 'Glow facial', description: 'A restorative facial with cleansing, massage and hydration.', price: 'NPR 1,800', duration: '75 min' }, { name: 'Classic manicure', description: 'Shape, cuticle care and a polished finish.', price: 'NPR 700', duration: '45 min' }], staff: [{ name: 'Aarati Lama', role: 'Beauty artist', image: '/aura-beauty.png' }, { name: 'Nima Gurung', role: 'Skin therapist', image: '/glow-salon.png' }], reviewHighlights: [{ name: 'Kusum T.', rating: '5.0', text: 'Professional, kind and very attentive from consultation to finish.' }] },
  { slug: 'evergreen-dental-clinic', name: 'Evergreen Dental Clinic', category: 'Clinics', location: 'Baneshwor, Kathmandu', rating: '4.9', reviews: '74', image: '/evergreen-clinic.png', logo: 'E', featured: 'Verified', description: 'Modern, patient-first dental care with easy appointment booking.', phone: '+977 9823456789', email: 'care@evergreendental.com', address: 'New Baneshwor, Kathmandu, Nepal', hours: { Monday: '8:00 AM – 5:00 PM', Tuesday: '8:00 AM – 5:00 PM', Wednesday: '8:00 AM – 5:00 PM', Thursday: '8:00 AM – 5:00 PM', Friday: '8:00 AM – 5:00 PM', Saturday: '9:00 AM – 2:00 PM', Sunday: 'Closed' }, services: [{ name: 'Dental consultation', description: 'A complete check-up and clear care recommendations.', price: 'NPR 500', duration: '30 min' }, { name: 'Teeth cleaning', description: 'Professional cleaning for a fresher, healthier smile.', price: 'NPR 2,000', duration: '45 min' }], staff: [{ name: 'Dr. Prakash Rai', role: 'Dental surgeon', image: '/evergreen-clinic.png' }], reviewHighlights: [{ name: 'Manisha K.', rating: '5.0', text: 'Gentle care, clear explanations and no waiting around.' }] },
  { slug: 'sajilo-kitchen', name: 'Sajilo Kitchen', category: 'Restaurants', location: 'Jhamsikhel, Lalitpur', rating: '4.8', reviews: '112', image: '/sajilo-kitchen.png', logo: 'S', featured: 'Popular', description: 'Comforting Nepali favourites and modern plates served in a relaxed neighbourhood dining room.', phone: '+977 9841234567', email: 'hello@sajilokitchen.com', address: 'Jhamsikhel Road, Lalitpur, Nepal', hours: { Monday: '11:00 AM – 9:00 PM', Tuesday: '11:00 AM – 9:00 PM', Wednesday: '11:00 AM – 9:00 PM', Thursday: '11:00 AM – 9:00 PM', Friday: '11:00 AM – 10:00 PM', Saturday: '10:00 AM – 10:00 PM', Sunday: '10:00 AM – 8:00 PM' }, services: [{ name: 'Table reservation', description: 'Reserve a table for lunch, dinner or a special occasion.', price: 'No booking fee', duration: '90 min' }, { name: 'Chef tasting menu', description: 'A guided tasting of seasonal Nepali ingredients and house favourites.', price: 'NPR 2,800', duration: '120 min' }], staff: [{ name: 'Aayush Shakya', role: 'Restaurant manager', image: '/sajilo-kitchen.png' }], reviewHighlights: [{ name: 'Nischal R.', rating: '5.0', text: 'Warm service, beautiful flavours and an easy reservation experience.' }] },
  { slug: 'rooftop-momo-house', name: 'Rooftop Momo House', category: 'Restaurants', location: 'Thamel, Kathmandu', rating: '4.7', reviews: '88', image: '/sajilo-kitchen.png', logo: 'R', featured: 'New', description: 'Hand-folded momos, local craft drinks and sunset tables in the heart of Thamel.', phone: '+977 9852345678', email: 'hello@rooftopmomo.com', address: 'Chaksibari Marg, Thamel, Kathmandu', hours: { Monday: '12:00 PM – 10:00 PM', Tuesday: '12:00 PM – 10:00 PM', Wednesday: '12:00 PM – 10:00 PM', Thursday: '12:00 PM – 10:00 PM', Friday: '12:00 PM – 11:00 PM', Saturday: '12:00 PM – 11:00 PM', Sunday: '12:00 PM – 9:00 PM' }, services: [{ name: 'Table reservation', description: 'Reserve a window or rooftop table for your next meal.', price: 'No booking fee', duration: '90 min' }, { name: 'Group dining', description: 'A hosted dining arrangement for groups of six or more.', price: 'From NPR 1,200', duration: '120 min' }], staff: [{ name: 'Saraswati Tamang', role: 'Guest experience lead', image: '/sajilo-kitchen.png' }], reviewHighlights: [{ name: 'Aashish K.', rating: '4.8', text: 'Great atmosphere and the booking made planning our group dinner easy.' }] },
  { slug: 'career-path-consultancy', name: 'Career Path Consultancy', category: 'Consultancy', location: 'Putalisadak, Kathmandu', rating: '4.7', reviews: '52', image: '/bhetaun-hero.png', logo: 'C', featured: 'Trusted', description: 'Practical guidance to help you make your next career move.', phone: '+977 9834567890', email: 'hello@careerpath.com', address: 'Putalisadak, Kathmandu, Nepal', hours: { Monday: '9:00 AM – 5:00 PM', Tuesday: '9:00 AM – 5:00 PM', Wednesday: '9:00 AM – 5:00 PM', Thursday: '9:00 AM – 5:00 PM', Friday: '9:00 AM – 5:00 PM', Saturday: '10:00 AM – 2:00 PM', Sunday: 'Closed' }, services: [{ name: 'Career clarity session', description: 'A focused one-to-one conversation to map your next move.', price: 'NPR 1,500', duration: '60 min' }, { name: 'CV review', description: 'Practical feedback to make your CV clearer and more compelling.', price: 'NPR 1,000', duration: '45 min' }], staff: [{ name: 'Sanjay Adhikari', role: 'Career advisor', image: '/bhetaun-hero.png' }], reviewHighlights: [{ name: 'Bibek S.', rating: '4.8', text: 'Clear advice and a very practical plan I could act on.' }] },
]

export function getBusiness(slug: string) {
  return businesses.find((business) => business.slug === slug) ?? businesses[0]
}
