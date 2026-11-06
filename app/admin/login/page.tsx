'use client'

import Link from 'next/link'
import { useState, type FormEvent } from 'react'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const supabase = () => createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading) return
    setError(''); setLoading(true)
    const { data, error: authError } = await supabase().auth.signInWithPassword({ email: email.trim(), password })
    if (authError || !data.user) {
      const message = authError?.message.toLowerCase() ?? ''
      setError(message.includes('rate limit') || message.includes('too many') ? 'Too many attempts. Wait for the Supabase cooldown to expire before trying again.' : message.includes('confirm') ? 'Please verify your email address before signing in.' : 'Invalid admin credentials.')
      setLoading(false); return
    }
    const { data: profile, error: profileError } = await supabase().from('profiles').select('role').eq('id', data.user.id).single()
    if (profileError || profile?.role !== 'Admin') { await supabase().auth.signOut(); setError('This account is not authorized for the Admin Portal.'); setLoading(false); return }
    router.push('/admin'); router.refresh()
  }

  return <main className="grid min-h-screen place-items-center bg-[#f4f8ff] px-5 py-10"><div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-[0_24px_70px_rgba(27,76,145,.12)] sm:p-10"><Link href="/auth" className="inline-flex items-center gap-2 text-sm font-bold text-[#155bd5]"><ArrowLeft size={16} /> Back to login</Link><div className="mt-10 grid size-14 place-items-center rounded-2xl bg-[#edf4ff] text-[#155bd5]"><ShieldCheck size={28} /></div><h1 className="mt-6 text-3xl font-extrabold text-[#172540]">Admin Portal</h1><p className="mt-2 text-sm leading-6 text-[#71809a]">Authorized Bhetaun administrators only.</p><form onSubmit={submit} className="mt-8 space-y-5"><label className="block text-sm font-bold">Admin email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-[#dce5f2] px-4 py-3 outline-none focus:border-[#155bd5]" /></label><label className="block text-sm font-bold">Password<input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-[#dce5f2] px-4 py-3 outline-none focus:border-[#155bd5]" /></label>{error && <p role="alert" className="rounded-xl bg-[#fff1f1] px-4 py-3 text-sm font-semibold text-[#c43d3d]">{error}</p>}<button disabled={loading} className="w-full rounded-xl bg-[#155bd5] py-3.5 text-sm font-bold text-white disabled:opacity-60">{loading ? 'Checking access…' : 'Enter Admin Portal'}</button></form></div></main>
}
