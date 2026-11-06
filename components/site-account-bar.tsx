'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ChevronDown, LogOut, UserCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { normalizeRole, type AppRole } from '@/lib/auth/roles'

type Account = { email: string; name: string; role: AppRole; avatar: string | null }

export function SiteAccountBar() {
  const [account, setAccount] = useState<Account | null>(null)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const supabase = createClient()
    let active = true
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !active) return
      const { data: profile } = await supabase.from('profiles').select('full_name, role, avatar_url').eq('id', user.id).maybeSingle()
      if (active) setAccount({ email: user.email ?? '', name: profile?.full_name ?? user.user_metadata?.full_name ?? 'Bhetaun member', role: normalizeRole(profile?.role), avatar: profile?.avatar_url ?? user.user_metadata?.avatar_url ?? null })
    }
    void load()
    const { data: listener } = supabase.auth.onAuthStateChange(() => { void load() })
    const close = (event: MouseEvent) => { if (!ref.current?.contains(event.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => { active = false; listener.subscription.unsubscribe(); document.removeEventListener('mousedown', close) }
  }, [])
  if (!account) return <div className="fixed right-4 top-4 z-50"><Link href="/auth" className="rounded-xl bg-[#155bd5] px-5 py-2.5 text-sm font-bold text-white shadow-sm">Get started</Link></div>
  const initials = account.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()
  return <div ref={ref} className="fixed right-4 top-4 z-50"><button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} className="flex items-center gap-2 rounded-full bg-white p-1.5 pr-3 shadow-sm ring-1 ring-[#dce5f2]"><span className="grid size-9 place-items-center overflow-hidden rounded-full bg-[#dbeafe] text-xs font-extrabold text-[#155bd5]">{account.avatar ? <img src={account.avatar} alt="" className="size-full object-cover" /> : initials}</span><span className="hidden max-w-28 truncate text-sm font-bold text-[#172540] sm:block">{account.name}</span><ChevronDown size={16} className="text-[#71809a]" /></button>{open && <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white p-2 shadow-xl ring-1 ring-[#e7edf5]"><div className="border-b border-[#edf1f6] px-3 pb-3 pt-2"><p className="truncate text-sm font-extrabold text-[#172540]">{account.name}</p><p className="truncate text-xs text-[#71809a]">{account.email}</p></div><Link href="/profile" className="mt-2 block rounded-xl px-3 py-2 text-sm font-semibold hover:bg-[#f4f8ff]">My Profile</Link>{account.role === 'customer' && <Link href="/dashboard" className="block rounded-xl px-3 py-2 text-sm font-semibold hover:bg-[#f4f8ff]">My Appointments</Link>}{account.role === 'vendor' && <Link href="/dashboard" className="block rounded-xl px-3 py-2 text-sm font-semibold hover:bg-[#f4f8ff]">My Business / Dashboard</Link>}{account.role === 'admin' && <Link href="/admin" className="block rounded-xl px-3 py-2 text-sm font-semibold hover:bg-[#f4f8ff]">Admin Dashboard</Link>}<Link href="/profile" className="block rounded-xl px-3 py-2 text-sm font-semibold hover:bg-[#f4f8ff]">Account Settings</Link><button type="button" onClick={async () => { await createClient().auth.signOut(); window.location.href = '/' }} className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-[#c43d3d] hover:bg-[#fff1f1]"><LogOut size={15} /> Logout</button></div>}</div>
}
