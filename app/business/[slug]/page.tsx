import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, Clock3, MapPin, Star } from 'lucide-react'

const details: Record<string, { name: string; category: string; location: string; image: string; description: string }> = {
  'glow-beauty-salon': { name: 'Glow Beauty Salon', category: 'Salons & Haircut', location: 'Lalitpur, Nepal', image: '/glow-salon.png', description: 'A warm, modern salon focused on thoughtful cuts, colour and styling for every day.' },
  'aura-beauty-parlour': { name: 'Aura Beauty Parlour', category: 'Beauty Parlour', location: 'Kathmandu, Nepal', image: '/aura-beauty.png', description: 'Relaxed beauty rituals, skincare and occasion-ready looks by a trusted local team.' },
  'evergreen-dental-clinic': { name: 'Evergreen Dental Clinic', category: 'Clinics', location: 'Baneshwor, Kathmandu', image: '/evergreen-clinic.png', description: 'Friendly, modern dental care in a calm environment for the whole family.' },
  'career-path-consultancy': { name: 'Career Path Consultancy', category: 'Consultancy', location: 'Putalisadak, Kathmandu', image: '/bhetaun-hero.png', description: 'Practical guidance for education, careers and the next step in your journey.' },
}

export default async function BusinessPage({ params }: { params: Promise<{ slug: string }> }) {
  const business = details[(await params).slug] ?? details['glow-beauty-salon']
  return <main className="min-h-screen bg-[#f8faff] px-5 py-8 text-[#1d2a43]"><div className="mx-auto max-w-5xl"><Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[#155bd5]"><ArrowLeft size={16} /> Back to Bhetaun</Link><div className="grid overflow-hidden rounded-[28px] bg-white shadow-[0_18px_50px_rgba(30,65,120,.1)] md:grid-cols-2"><div className="relative min-h-[320px]"><Image src={business.image} alt={business.name} fill className="object-cover" /></div><div className="p-8 sm:p-12"><span className="text-sm font-bold uppercase tracking-[.15em] text-[#155bd5]">{business.category}</span><h1 className="mt-3 text-4xl font-extrabold tracking-tight">{business.name}</h1><p className="mt-4 flex items-center gap-2 text-sm text-[#7b879b]"><MapPin size={16} /> {business.location}</p><div className="mt-5 flex items-center gap-1 text-sm font-bold text-[#dd9b27]"><Star size={16} fill="currentColor" /> 4.9 <span className="font-normal text-[#8a95a8]">(128 reviews)</span></div><p className="mt-6 leading-7 text-[#68758c]">{business.description}</p><Link href={`/book/${(await params).slug}`} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#155bd5] px-5 py-3 text-sm font-bold text-white hover:bg-[#104bb5]">Book an appointment <CalendarDays size={17} /></Link></div></div></div></main>
}
