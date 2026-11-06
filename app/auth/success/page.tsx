'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { normalizeRole } from '@/lib/auth/roles'

export default function AuthSuccessPage() {
  const router = useRouter()
  const [message, setMessage] = useState('Checking your account…')

  useEffect(() => {
    let active = true
    const supabase = createClient()
    async function finishAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { if (active) setMessage('Your session could not be created.'); return }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
      if (!active) return
      router.replace(normalizeRole(profile?.role) === 'admin' ? '/admin' : '/dashboard')
    }
    void finishAuth()
    return () => { active = false }
  }, [router])

  return <main className="grid min-h-screen place-items-center bg-[#f4f8ff] px-5"><section className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-[0_24px_70px_rgba(27,76,145,.12)]"><div className="mx-auto grid size-14 place-items-center rounded-full bg-[#edf9f3] text-2xl text-[#18845b]">✓</div><h1 className="mt-6 text-3xl font-extrabold text-[#172540]">{message}</h1><p className="mt-3 text-sm leading-6 text-[#71809a]">Your Bhetaun session is being prepared securely.</p><Link href="/auth" className="mt-7 inline-flex rounded-xl bg-[#155bd5] px-6 py-3 text-sm font-bold text-white">Continue to login</Link></section></main>
}
