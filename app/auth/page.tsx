'use client'

import Link from 'next/link'
import { useState, type FormEvent } from 'react'
import { ArrowLeft, Check, Eye, EyeOff, LockKeyhole, UserRound } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const roles = [
  { id: 'customer', label: 'Customer', detail: 'Book and manage appointments.' },
  { id: 'vendor', label: 'Vendor / Business Owner', detail: 'List your business and manage bookings.' },
]

const passwordRules = [
  { label: '9+ characters', test: (value: string) => value.length >= 9 },
  { label: 'Uppercase letter', test: (value: string) => /[A-Z]/.test(value) },
  { label: 'Lowercase letter', test: (value: string) => /[a-z]/.test(value) },
  { label: 'Number', test: (value: string) => /\d/.test(value) },
  { label: 'Special symbol', test: (value: string) => /[^A-Za-z0-9]/.test(value) },
]

export default function AuthPage() {
  const router = useRouter()
  const supabase = createClient()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [role, setRole] = useState('customer')
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)
  const validPassword = passwordRules.every((rule) => rule.test(password))

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setNotice('')
    if (mode === 'signup' && !validPassword) return setError('Choose a password that meets every requirement.')
    setLoading(true)
    const result = mode === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback`, data: { full_name: fullName, role: role === 'vendor' ? 'Vendor / Business Owner' : 'Customer' } } })
    setLoading(false)
    if (result.error) {
      const isCredentialError = result.error.message.toLowerCase().includes('invalid') || result.error.message.toLowerCase().includes('credentials')
      setError(isCredentialError ? 'Invalid email or password.' : result.error.message)
      return
    }
    if (mode === 'signup') {
      setNotice('Account created. Check your email to confirm your account, then sign in.')
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return <main className="min-h-screen bg-[#f4f8ff] px-5 py-8 text-[#1d2a43] sm:py-12"><div className="mx-auto max-w-6xl"><Link href="/" className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-[#155bd5]"><ArrowLeft size={16} /> Back to home</Link><div className="grid overflow-hidden rounded-3xl bg-white shadow-[0_24px_70px_rgba(27,76,145,.12)] lg:grid-cols-[.9fr_1.1fr]"><section className="hidden bg-[#155bd5] p-12 text-white lg:block"><div className="mb-20 grid size-11 place-items-center rounded-xl bg-white/15 text-xl font-semibold">भे</div><p className="mb-4 text-sm font-bold uppercase tracking-[.18em] text-blue-100">Bhetaun भेटौँ</p><h1 className="max-w-sm text-4xl font-extrabold leading-tight">A better way to book your time.</h1><p className="mt-5 max-w-sm leading-7 text-blue-100">Join Nepal&apos;s growing appointment marketplace and connect with trusted local businesses.</p><div className="mt-12 space-y-4 text-sm text-blue-50"><p className="flex items-center gap-3"><span className="grid size-7 place-items-center rounded-full bg-white/15"><Check size={15} /></span> Easy, secure appointment booking</p><p className="flex items-center gap-3"><span className="grid size-7 place-items-center rounded-full bg-white/15"><Check size={15} /></span> Trusted and verified businesses</p></div></section><section className="p-6 sm:p-10 lg:p-14"><div className="mb-8 flex rounded-xl bg-[#f3f6fb] p-1"><button type="button" onClick={() => { setMode('login'); setError(''); setNotice('') }} className={`flex-1 rounded-lg py-2.5 text-sm font-bold ${mode === 'login' ? 'bg-white text-[#155bd5] shadow-sm' : 'text-[#7a879d]'}`}>Log in</button><button type="button" onClick={() => { setMode('signup'); setError(''); setNotice('') }} className={`flex-1 rounded-lg py-2.5 text-sm font-bold ${mode === 'signup' ? 'bg-white text-[#155bd5] shadow-sm' : 'text-[#7a879d]'}`}>Sign up</button></div><h2 className="text-3xl font-extrabold text-[#172540]">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2><p className="mt-2 text-sm text-[#7a879d]">{mode === 'login' ? 'Log in to manage bookings and appointments.' : 'Choose how you will use Bhetaun.'}</p><form onSubmit={handleSubmit} className="mt-8 space-y-5">{mode === 'signup' && <label className="block text-sm font-bold">Full name<input required value={fullName} onChange={(event) => setFullName(event.target.value)} className="mt-2 w-full rounded-xl border border-[#dce5f2] px-4 py-3 font-normal outline-none focus:border-[#155bd5]" placeholder="Your name" /></label>}<label className="block text-sm font-bold">Email address<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-[#dce5f2] px-4 py-3 font-normal outline-none focus:border-[#155bd5]" placeholder="you@example.com" /></label><label className="block text-sm font-bold">Password<div className="relative mt-2"><LockKeyhole size={17} className="absolute left-4 top-3.5 text-[#9aa6b9]" /><input required type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-[#dce5f2] px-11 py-3 pr-12 font-normal outline-none focus:border-[#155bd5]" placeholder="Your password" /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-2.5 rounded-lg p-1 text-[#7a879d]">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>{mode === 'signup' && <><div><p className="text-sm font-bold">Account type</p><div className="mt-2 grid gap-2 sm:grid-cols-2">{roles.map((item) => <button type="button" key={item.id} onClick={() => setRole(item.id)} className={`rounded-xl border p-3 text-left ${role === item.id ? 'border-[#155bd5] bg-[#eef5ff]' : 'border-[#dce5f2]'}`}><span className="flex items-center gap-2 text-sm font-bold"><UserRound size={15} /> {item.label}</span><span className="mt-1 block text-xs text-[#7a879d]">{item.detail}</span></button>)}</div></div><div className="grid grid-cols-2 gap-2 rounded-xl bg-[#f7faff] p-3 text-xs text-[#7a879d]">{passwordRules.map((rule) => <span key={rule.label} className={rule.test(password) ? 'font-bold text-[#18845b]' : ''}>{rule.test(password) ? '✓' : '○'} {rule.label}</span>)}</div></>} {error && <p role="alert" className="rounded-xl bg-[#fff1f1] px-4 py-3 text-sm font-semibold text-[#bd4242]">{error}</p>}{notice && <p role="status" className="rounded-xl bg-[#edf9f3] px-4 py-3 text-sm font-semibold text-[#18845b]">{notice}</p>}<button disabled={loading} className="w-full rounded-xl bg-[#155bd5] py-3.5 text-sm font-bold text-white transition hover:bg-[#104bb5] disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}</button></form><p className="mt-6 text-center text-xs leading-5 text-[#8b97a9]">Admin access is invitation-only. Contact your Bhetaun administrator for an admin account.</p></section></div></div></main>
}
