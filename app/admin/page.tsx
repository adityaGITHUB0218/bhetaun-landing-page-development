import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')
  const { data: profile } = await supabase.from('profiles').select('role, full_name').eq('id', user.id).single()
  if (profile?.role !== 'Admin') redirect('/dashboard')
  const [{ count: users }, { count: pending }, { count: businesses }] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('businesses').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('businesses').select('id', { count: 'exact', head: true }),
  ])
  return <main className="min-h-screen bg-[#f7faff] px-5 py-10 text-[#1d2a43]"><div className="mx-auto max-w-6xl"><Link href="/" className="text-sm font-bold text-[#155bd5]">Bhetaun भेटौँ</Link><div className="mt-8 flex items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-[.16em] text-[#155bd5]">Admin Portal</p><h1 className="mt-2 text-4xl font-extrabold">Platform overview</h1><p className="mt-2 text-sm text-[#71809a]">Signed in as {profile.full_name || user.email}</p></div><Link href="/dashboard" className="rounded-xl border border-[#dce5f2] bg-white px-4 py-2.5 text-sm font-bold text-[#155bd5]">Open dashboard</Link></div><div className="mt-8 grid gap-4 sm:grid-cols-3">{[['Registered users', users ?? 0], ['Pending approvals', pending ?? 0], ['Businesses', businesses ?? 0]].map(([label, value]) => <div key={label} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e6edf7]"><p className="text-3xl font-extrabold">{value}</p><p className="mt-2 text-sm text-[#71809a]">{label}</p></div>)}</div><section className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e6edf7]"><h2 className="text-xl font-extrabold">Admin access protected</h2><p className="mt-2 text-sm leading-6 text-[#71809a]">Business approvals and platform operations are available only to accounts whose server-side profile role is Admin.</p></section></div></main>
}
