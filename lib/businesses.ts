export type Business = {
  slug: string
  name: string
  category: string
  location: string
  rating: string
  reviews: string
  image: string
  featured: string
  description: string
}

export const categories = [
  'All categories',
  'Salons & Haircut',
  'Beauty Parlour',
  'Clinics',
  'Consultancy',
  'Fitness & Gym',
] as const

export const businesses: Business[] = [
  { slug: 'glow-beauty-salon', name: 'Glow Beauty Salon', category: 'Salons & Haircut', location: 'Lalitpur, Nepal', rating: '4.9', reviews: '128', image: '/glow-salon.png', featured: 'Popular', description: 'Thoughtful hair and beauty appointments in a calm, welcoming space.' },
  { slug: 'aura-beauty-parlour', name: 'Aura Beauty Parlour', category: 'Beauty Parlour', location: 'Kathmandu, Nepal', rating: '4.8', reviews: '96', image: '/aura-beauty.png', featured: 'Top rated', description: 'Personalized beauty care from a friendly team of professionals.' },
  { slug: 'evergreen-dental-clinic', name: 'Evergreen Dental Clinic', category: 'Clinics', location: 'Baneshwor, Kathmandu', rating: '4.9', reviews: '74', image: '/evergreen-clinic.png', featured: 'Verified', description: 'Modern, patient-first dental care with easy appointment booking.' },
  { slug: 'career-path-consultancy', name: 'Career Path Consultancy', category: 'Consultancy', location: 'Putalisadak, Kathmandu', rating: '4.7', reviews: '52', image: '/bhetaun-hero.png', featured: 'Trusted', description: 'Practical guidance to help you make your next career move.' },
]
