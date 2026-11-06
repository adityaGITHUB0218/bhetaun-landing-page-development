'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setMessage('')
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirmation) { setError('Passwords do not match.'); return }
    setLoading(true)
    const { error: updateError } = await createClient().auth.updateUser({ password })
    setLoading(false)
    if (updateError) { setError('This reset link is invalid or expired. Request a new one from the login page.'); return }
    setMessage('Your password has been updated securely.')
    window.setTimeout(() => router.replace('/auth'), 1200)
  }

  return <main className="grid min-h-screen place-items-center bg-[#f4f8ff] px-5 py-10 text-[#172540]"><section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-[0_24px_70px_rgba(27,76,145,.12)] sm:p-10"><Link href="/auth" className="text-sm font-bold text-[#155bd5]">Back to login</Link><h1 className="mt-8 text-3xl font-extrabold">Create a new password</h1><p className="mt-3 text-sm leading-6 text-[#71809a]">Choose a strong password for your Bhetaun account.</p><form onSubmit={handleSubmit} className="mt-8 space-y-5"><label className="block text-sm font-bold">New password<input required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-[#dce5f2] px-4 py-3 outline-none focus:border-[#155bd5]" /></label><label className="block text-sm font-bold">Confirm password<input required minLength={8} type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="mt-2 w-full rounded-xl border border-[#dce5f2] px-4 py-3 outline-none focus:border-[#155bd5]" /></label>{error && <p role="alert" className="rounded-xl bg-[#fff1f1] px-4 py-3 text-sm font-semibold text-[#c43d3d]">{error}</p>}{message && <p role="status" className="rounded-xl bg-[#edf9f3] px-4 py-3 text-sm font-semibold text-[#18845b]">{message}</p>}<button disabled={loading} className="w-full rounded-xl bg-[#155bd5] py-3.5 text-sm font-bold text-white disabled:opacity-60">{loading ? 'Updating…' : 'Update password'}</button></form></section></main>
}
