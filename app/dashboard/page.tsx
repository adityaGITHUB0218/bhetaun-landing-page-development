'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, CalendarDays, CheckCircle2, LogOut, Plus, Store, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Profile = { role: 'Customer' | 'Vendor / Business Owner' | 'Admin'; full_name: string | null }
type Appointment = { id: string; appointment_date: string; starts_at: string; status: string; total_price: number; business: { name: string } | null }
type Business = { id: string; name: string; status: string; rating: number; review_count: number }

export default function DashboardPage() {
  const supabase = useMemo(() => createClient(), [])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [counts, setCounts] = useState({ users: 0, pending: 0, businesses: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadDashboard() {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData.user) { setError('Please log in to view your dashboard.'); setLoading(false); return }
      const userId = userData.user.id
      const profileResult = await supabase.from('profiles').select('role, full_name').eq('id', userId).single()
      if (profileResult.error) { setError('We could not load your profile.'); setLoading(false); return }
      const currentProfile = profileResult.data as Profile
      setProfile(currentProfile)
      if (currentProfile.role === 'Customer') {
        const result = await supabase.from('appointments').select('id, appointment_date, starts_at, status, total_price, business:businesses(name)').eq('customer_id', userId).order('appointment_date', { ascending: true })
        if (!result.error) setAppointments((result.data ?? []) as unknown as Appointment[])
      } else if (currentProfile.role === 'Vendor / Business Owner') {
        const businessResult = await supabase.from('businesses').select('id, name, status, rating, review_count').eq('owner_id', userId).order('created_at', { ascending: false })
        if (!businessResult.error) setBusinesses((businessResult.data ?? []) as Business[])
        const ownedIds = (businessResult.data ?? []).map((business) => business.id)
        if (ownedIds.length) {
          const appointmentResult = await supabase.from('appointments').select('id, appointment_date, starts_at, status, total_price, business:businesses(name)').in('business_id', ownedIds).order('appointment_date', { ascending: true })
          if (!appointmentResult.error) setAppointments((appointmentResult.data ?? []) as unknown as Appointment[])
        }
      } else {
        const [businessResult, pendingResult, userResult] = await Promise.all([supabase.from('businesses').select('id, name, status, rating, review_count'), supabase.from('businesses').select('id', { count: 'exact', head: true }).eq('status', 'pending'), supabase.from('profiles').select('id', { count: 'exact', head: true })])
        setBusinesses((businessResult.data ?? []) as Business[])
        setCounts({ users: userResult.count ?? 0, pending: pendingResult.count ?? 0, businesses: businessResult.data?.length ?? 0 })
      }
      setLoading(false)
    }
    loadDashboard()
  }, [supabase])

  async function signOut() { await supabase.auth.signOut(); window.location.href = '/' }
  if (loading) return <main className="grid min-h-screen place-items-center bg-[#f7faff] text-sm text-[#71809a]">Loading your dashboard…</main>
  if (error || !profile) return <main className="grid min-h-screen place-items-center bg-[#f7faff] px-5"><div className="rounded-2xl bg-white p-8 text-center shadow-sm"><h1 className="font-extrabold">Dashboard unavailable</h1><p className="mt-2 text-sm text-[#71809a]">{error}</p><Link href="/auth" className="mt-5 inline-flex rounded-xl bg-[#155bd5] px-5 py-3 text-sm font-bold text-white">Log in</Link></div></main>
  const isAdmin = profile.role === 'Admin'
  const isVendor = profile.role === 'Vendor / Business Owner'
  return <main className="min-h-screen bg-[#f7faff] px-5 py-8 text-[#1d2a43] sm:py-12"><div className="mx-auto max-w-6xl"><header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><Link href="/" className="text-sm font-bold text-[#155bd5]">Bhetaun भेटौँ</Link><h1 className="mt-3 text-3xl font-extrabold tracking-tight">{isAdmin ? 'Admin overview' : `Welcome back${profile.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}`}</h1><p className="mt-2 text-sm text-[#71809a]">{profile.role}</p></div><div className="flex gap-2"><Link href="/businesses" className="rounded-xl border border-[#dce5f2] bg-white px-4 py-2.5 text-sm font-bold text-[#155bd5]">Explore businesses</Link><button type="button" onClick={signOut} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-[#71809a] hover:bg-white"><LogOut size={16} /> Sign out</button></div></header>{isAdmin ? <><div className="mt-8 grid gap-4 sm:grid-cols-3"><Stat icon={<Users />} label="Registered users" value={counts.users} /><Stat icon={<Store />} label="Businesses" value={counts.businesses} /><Stat icon={<CalendarDays />} label="Pending approvals" value={counts.pending} /></div><section className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e6edf7]"><h2 className="text-xl font-extrabold">Business approvals</h2><div className="mt-5 space-y-3">{businesses.length ? businesses.map((business) => <div key={business.id} className="flex flex-col justify-between gap-3 rounded-xl border border-[#e7edf6] p-4 sm:flex-row sm:items-center"><div><p className="font-bold">{business.name}</p><p className="mt-1 text-xs text-[#7b879b]">{business.status} · {business.rating} rating · {business.review_count} reviews</p></div><button type="button" className="rounded-lg bg-[#edf4ff] px-3 py-2 text-xs font-bold text-[#155bd5]">Review listing</button></div>) : <Empty text="No businesses have been submitted yet." />}</div></section></> : isVendor ? <><section className="mt-8 flex flex-col justify-between gap-4 rounded-2xl bg-[#155bd5] p-6 text-white sm:flex-row sm:items-center"><div><h2 className="text-xl font-extrabold">Grow your local business</h2><p className="mt-2 text-sm text-blue-100">Submit your business profile for admin approval and start receiving bookings.</p></div><button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#155bd5]"><Plus size={16} /> Add business</button></section><DashboardSection title="Your businesses">{businesses.length ? businesses.map((business) => <div key={business.id} className="rounded-xl border border-[#e7edf6] p-4"><p className="font-bold">{business.name}</p><p className="mt-1 text-xs text-[#7b879b]">{business.status} · {business.rating} rating · {business.review_count} reviews</p></div>) : <Empty text="Your submitted businesses will appear here." />}</DashboardSection><DashboardSection title="Incoming appointments">{appointments.length ? appointments.map((appointment) => <Appointment key={appointment.id} appointment={appointment} />) : <Empty text="No incoming appointments yet." />}</DashboardSection></> : <DashboardSection title="Your appointments">{appointments.length ? appointments.map((appointment) => <Appointment key={appointment.id} appointment={appointment} />) : <Empty text="You have no appointments yet. Find a business to get started." action />}</DashboardSection>}</div></main>
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) { return <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#e6edf7]"><div className="text-[#155bd5]">{icon}</div><p className="mt-4 text-3xl font-extrabold">{value}</p><p className="mt-1 text-sm text-[#71809a]">{label}</p></div> }
function DashboardSection({ title, children }: { title: string; children: React.ReactNode }) { return <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e6edf7]"><h2 className="text-xl font-extrabold">{title}</h2><div className="mt-5 space-y-3">{children}</div></section> }
function Appointment({ appointment }: { appointment: Appointment }) { return <div className="flex flex-col justify-between gap-3 rounded-xl border border-[#e7edf6] p-4 sm:flex-row sm:items-center"><div><p className="font-bold">{appointment.business?.name ?? 'Business'}</p><p className="mt-1 text-sm text-[#7b879b]">{appointment.appointment_date} at {appointment.starts_at.slice(0, 5)} · NPR {Number(appointment.total_price).toLocaleString()}</p></div><span className="inline-flex w-fit items-center gap-1 rounded-full bg-[#edf9f3] px-3 py-1 text-xs font-bold text-[#18845b]"><CheckCircle2 size={13} /> {appointment.status}</span></div> }
function Empty({ text, action = false }: { text: string; action?: boolean }) { return <div className="rounded-xl border border-dashed border-[#cbd9ed] p-7 text-center text-sm text-[#7b879b]">{text}{action && <Link href="/businesses" className="mt-3 inline-flex items-center gap-2 font-bold text-[#155bd5]">Explore businesses <ArrowRight size={15} /></Link>}</div> }
