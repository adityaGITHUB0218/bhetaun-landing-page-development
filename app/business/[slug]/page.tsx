import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Clock3, Mail, MapPin, Phone, Star } from 'lucide-react'
import { BusinessBookingPanel } from '@/components/business-booking-panel'
import { getBusiness, type Service } from '@/lib/businesses'

function serviceGroup(businessCategory: string, service: Service) {
  if (service.category) return service.category
  if (businessCategory === 'Restaurants') {
    if (service.name.toLowerCase().includes('reservation')) return 'Reservations'
    if (service.name.toLowerCase().includes('tasting')) return 'Main Course'
    return 'Group Dining'
  }
  if (businessCategory === 'Salons & Haircut') {
    if (service.name.toLowerCase().includes('colour')) return 'Hair Colour'
    if (service.name.toLowerCase().includes('facial')) return 'Facial'
    if (service.name.toLowerCase().includes('blow') || service.name.toLowerCase().includes('styling')) return 'Hair Styling & Treatments'
    return 'Haircuts'
  }
  return 'Services'
}

export default async function BusinessPage({ params }: { params: Promise<{ slug: string }> }) {
  const business = getBusiness((await params).slug)
  const groupedServices = business.services.reduce<Record<string, Service[]>>((result, service) => { const group = serviceGroup(business.category, service); (result[group] ??= []).push(service); return result }, {})
  return <main className="min-h-screen bg-[#f8faff] px-5 py-8 text-[#1d2a43] sm:py-12"><div className="mx-auto max-w-6xl"><Link href="/businesses" className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-[#155bd5]"><ArrowLeft size={16} /> All businesses</Link><section className="overflow-hidden rounded-[30px] bg-white shadow-[0_18px_50px_rgba(30,65,120,.1)]"><div className="relative h-64 sm:h-80"><Image src={business.image} alt={`${business.name} cover`} fill priority className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#10264e]/75 via-transparent to-transparent" /><div className="absolute bottom-0 left-0 flex items-end gap-4 p-6 text-white sm:p-9"><div className="grid size-16 place-items-center rounded-2xl bg-white text-2xl font-extrabold text-[#155bd5] shadow-lg">{business.logo}</div><div><span className="text-xs font-bold uppercase tracking-[.16em] text-[#dce9ff]">{business.category}</span><h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">{business.name}</h1><p className="mt-1 flex items-center gap-2 text-sm text-white/85"><MapPin size={15} /> {business.location}</p></div></div></div><div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[1.1fr_.9fr]"><div><div className="flex flex-wrap items-center gap-4"><span className="flex items-center gap-1 font-bold text-[#dd9b27]"><Star size={17} fill="currentColor" /> {business.rating} <span className="font-normal text-[#8995a8]">({business.reviews} reviews)</span></span><span className="flex items-center gap-2 text-sm text-[#7b879b]"><Clock3 size={16} /> Open today</span></div><p className="mt-5 leading-7 text-[#68758c]">{business.description}</p><h2 className="mt-9 text-xl font-extrabold">Services & menu</h2><p className="mt-2 text-sm text-[#7b879b]">Select what you need in the booking panel.</p><div className="mt-5 space-y-6">{Object.entries(groupedServices).map(([group, services]) => <section key={group}><h3 className="mb-3 text-sm font-bold uppercase tracking-[.14em] text-[#155bd5]">{group}</h3><div className="space-y-3">{services.map((service) => <div key={service.name} className="rounded-2xl border border-[#e4eaf3] p-4"><div className="flex items-start justify-between gap-4"><h4 className="font-bold">{service.name}</h4><span className="shrink-0 text-sm font-extrabold text-[#155bd5]">{service.price}</span></div><p className="mt-2 text-sm leading-6 text-[#7b879b]">{service.description}</p><p className="mt-2 text-xs font-semibold text-[#8490a3]">{service.duration}</p></div>)}</div></section>)}</div><h2 className="mt-9 text-xl font-extrabold">Meet the team</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{business.staff.map((member) => <div key={member.name} className="rounded-2xl bg-[#f4f8ff] p-4"><div className="font-bold">{member.name}</div><div className="mt-1 text-sm text-[#7b879b]">{member.role}</div></div>)}</div></div><aside><BusinessBookingPanel services={business.services} /><div className="mt-6 rounded-2xl border border-[#e4eaf3] p-5"><h2 className="font-extrabold">Contact & location</h2><div className="mt-4 space-y-3 text-sm text-[#71809a]"><p className="flex items-center gap-3"><Phone size={16} className="text-[#155bd5]" /> {business.phone}</p><p className="flex items-center gap-3"><Mail size={16} className="text-[#155bd5]" /> {business.email}</p><p className="flex items-center gap-3"><MapPin size={16} className="text-[#155bd5]" /> {business.address}</p></div></div></aside></div></section></div></main>
}
