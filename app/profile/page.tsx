'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { normalizeRole } from '@/lib/auth/roles'
import { BackButton } from '@/components/back-button'

export default function ProfilePage() {
  const [userId, setUserId] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [role, setRole] = useState('customer')
  const [createdAt, setCreatedAt] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  useEffect(() => { const load = async () => { const supabase = createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) { window.location.href = '/auth'; return }; setUserId(user.id); setEmail(user.email ?? ''); setCreatedAt(user.created_at); const { data: profile } = await supabase.from('profiles').select('full_name, phone, avatar_url, role').eq('id', user.id).maybeSingle(); setName(profile?.full_name ?? user.user_metadata?.full_name ?? ''); setPhone(profile?.phone ?? ''); setAvatarUrl(profile?.avatar_url ?? ''); setRole(normalizeRole(profile?.role)) }; void load() }, [])
  async function save() { setSaving(true); setError(''); setMessage(''); const { error: saveError } = await createClient().from('profiles').upsert({ id: userId, full_name: name.trim(), phone: phone.trim() || null, avatar_url: avatarUrl.trim() || null }, { onConflict: 'id' }); setSaving(false); if (saveError) setError('We could not save your profile. Please try again.'); else setMessage('Profile updated successfully.') }
  return <main className="min-h-screen bg-[#f7faff] px-5 py-10 text-[#172540]"><div className="mx-auto max-w-3xl"><BackButton fallback="/dashboard" /><section className="mt-8 rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(27,76,145,.1)] sm:p-10"><div className="flex flex-col gap-5 sm:flex-row sm:items-center"><div className="grid size-20 place-items-center overflow-hidden rounded-full bg-[#dbeafe] text-2xl font-extrabold text-[#155bd5]">{avatarUrl ? <img src={avatarUrl} alt="Profile" className="size-full object-cover" /> : name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</div><div><p className="text-sm font-bold uppercase tracking-[.16em] text-[#155bd5]">Account profile</p><h1 className="mt-1 text-3xl font-extrabold">{name || 'Your profile'}</h1><p className="mt-1 text-sm text-[#71809a]">{email}</p></div></div><div className="mt-8 grid gap-5 sm:grid-cols-2"><label className="text-sm font-bold">Full name<input value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-xl border border-[#dce5f2] px-4 py-3 outline-none focus:border-[#155bd5]" /></label><label className="text-sm font-bold">Phone number<input value={phone} onChange={(event) => setPhone(event.target.value)} className="mt-2 w-full rounded-xl border border-[#dce5f2] px-4 py-3 outline-none focus:border-[#155bd5]" placeholder="98XXXXXXXX" /></label><label className="text-sm font-bold sm:col-span-2">Profile image URL<input value={avatarUrl} onChange={(event) => setAvatarUrl(event.target.value)} className="mt-2 w-full rounded-xl border border-[#dce5f2] px-4 py-3 outline-none focus:border-[#155bd5]" placeholder="https://…" /></label></div><div className="mt-6 grid gap-2 text-sm text-[#71809a]"><p><strong className="text-[#172540]">Role:</strong> {role}</p><p><strong className="text-[#172540]">Registered:</strong> {createdAt ? new Date(createdAt).toLocaleDateString() : '—'}</p></div>{error && <p role="alert" className="mt-5 rounded-xl bg-[#fff1f1] px-4 py-3 text-sm font-semibold text-[#c43d3d]">{error}</p>}{message && <p role="status" className="mt-5 rounded-xl bg-[#edf9f3] px-4 py-3 text-sm font-semibold text-[#18845b]">{message}</p>}<button type="button" onClick={save} disabled={saving} className="mt-7 rounded-xl bg-[#155bd5] px-6 py-3 text-sm font-bold text-white disabled:opacity-60">{saving ? 'Saving…' : 'Save profile changes'}</button></section></div></main>
}
