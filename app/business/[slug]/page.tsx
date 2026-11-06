import { notFound } from 'next/navigation'
import { MapPin, Phone, Mail, Clock3, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { BusinessBookingPanel } from '@/components/business-booking-panel'
import { BackButton } from '@/components/back-button'

type DbService = { name?: string; title?: string; description?: string | null; price?: number | string | null; duration?: string | number | null; duration_minutes?: number | null; category?: string | null }
type DbBusiness = { id: string; slug: string; name: string; description?: string | null; address?: string | null; city?: string | null; phone?: string | null; email?: string | null; logo_url?: string | null; cover_image_url?: string | null; rating?: number | null; review_count?: number | null; hours?: Record<string, string> | null; categories?: { name?: string } | null; services?: DbService[] | null }

function serviceRows(services: DbService[] = []) {
  return services.map((service) => ({ name: service.name ?? service.title ?? 'Service', description: service.description ?? 'Appointment service', price: `NPR ${Number(service.price ?? 0).toLocaleString()}`, duration: `${service.duration_minutes ?? service.duration ?? 30} min`, category: service.category ?? 'Services' }))
}

export default async function BusinessDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('businesses').select('*, categories(name), services(*)').eq('slug', slug).eq('status', 'approved').maybeSingle()
  const business = data as DbBusiness | null
  if (!business) notFound()
  const rating = business.rating ?? 0
  const hours = business.hours ?? { Monday: '9:00 AM – 6:00 PM', Tuesday: '9:00 AM – 6:00 PM', Wednesday: '9:00 AM – 6:00 PM', Thursday: '9:00 AM – 6:00 PM', Friday: '9:00 AM – 6:00 PM', Saturday: '10:00 AM – 4:00 PM', Sunday: 'Closed' }
  const services = serviceRows(business.services ?? [])
  return <main className="min-h-screen bg-[#f7faff] px-5 py-10 text-[#1d2a43] lg:px-8"><div className="mx-auto max-w-6xl"><BackButton fallback="/businesses" /><section className="mt-7 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-[#e7edf5]"><div className="h-64 bg-[#eaf2ff]">{business.cover_image_url || business.logo_url ? <img src={business.cover_image_url || business.logo_url || ''} alt="" className="size-full object-cover" /> : <div className="grid size-full place-items-center text-7xl font-extrabold text-[#155bd5]">{business.name[0]}</div>}</div><div className="p-6 sm:p-9"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#155bd5]">{business.categories?.name ?? 'Local business'}</p><div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row"><div><h1 className="text-4xl font-extrabold tracking-[-.04em]">{business.name}</h1><p className="mt-3 max-w-2xl leading-7 text-[#71809a]">{business.description ?? 'A trusted local provider on Bhetaun.'}</p></div><div className="flex items-center gap-2 text-sm font-bold"><Star size={17} className="fill-[#f5b73a] text-[#f5b73a]" /> {rating || 'New'} <span className="font-normal text-[#71809a]">({business.review_count ?? 0} reviews)</span></div></div><div className="mt-7 grid gap-3 border-t border-[#edf1f6] pt-6 text-sm text-[#71809a] sm:grid-cols-3"><span className="flex items-center gap-2"><MapPin size={16} className="text-[#155bd5]" /> {business.address ?? business.city ?? 'Nepal'}</span><span className="flex items-center gap-2"><Phone size={16} className="text-[#155bd5]" /> {business.phone ?? 'Demo contact — Bhetaun'}</span><span className="flex items-center gap-2"><Mail size={16} className="text-[#155bd5]" /> {business.email ?? 'demo@bhetaun.local'}</span></div></div></section><section className="mt-7 grid gap-7 lg:grid-cols-[1.2fr_.8fr]"><BusinessBookingPanel services={services} /><aside className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#e7edf5]"><div className="flex items-center gap-3"><Clock3 className="text-[#155bd5]" size={20} /><h2 className="font-extrabold">Opening hours</h2></div><div className="mt-5 space-y-3 text-sm">{Object.entries(hours).map(([day, value]) => <div key={day} className="flex justify-between gap-4"><span className="font-semibold text-[#53617a]">{day}</span><span className="text-right text-[#71809a]">{value}</span></div>)}</div><p className="mt-6 rounded-xl bg-[#f4f8ff] p-3 text-xs leading-5 text-[#71809a]">Demo listing — contact details are for presentation only.</p></aside></section></div></main>
}
