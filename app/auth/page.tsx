'use client'

import Link from 'next/link'
import { useState, type FormEvent } from 'react'
import { ArrowLeft, Check, Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const passwordRules = [
  ['9+ characters', (value: string) => value.length >= 9],
  ['Uppercase letter', (value: string) => /[A-Z]/.test(value)],
  ['Lowercase letter', (value: string) => /[a-z]/.test(value)],
  ['Number', (value: string) => /\d/.test(value)],
  ['Special symbol', (value: string) => /[^A-Za-z0-9]/.test(value)],
] as const

function authError(message: string) {
  const normalized = message.toLowerCase()
  if (normalized.includes('email not confirmed') || normalized.includes('confirm')) return 'Please verify your email address before signing in.'
  if (normalized.includes('invalid') || normalized.includes('credential') || normalized.includes('not found')) return 'Invalid email or password.'
  if (normalized.includes('rate limit')) return 'Too many attempts. Please wait a moment and try again.'
  if (normalized.includes('network') || normalized.includes('fetch')) return 'We could not reach Supabase. Check your connection and try again.'
  return 'We could not complete that request. Please try again.'
}

export default function AuthPage() {
  const router = useRouter()
  const supabase = () => createClient()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [role, setRole] = useState<'customer' | 'vendor'>('customer')
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)
  const validPassword = passwordRules.every(([, test]) => test(password))

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(''); setNotice('')
    if (mode === 'signup' && !validPassword) { setError('Choose a password that meets every requirement.'); return }
    setLoading(true)
    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase().auth.signUp({
          email: email.trim(), password,
          options: {
            emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback?next=/auth/success`,
            data: { full_name: fullName.trim(), role: role === 'vendor' ? 'Vendor / Business Owner' : 'Customer' },
          },
        })
        if (signUpError) throw signUpError
        setNotice(data.session ? 'Your account is ready. You can sign in now.' : 'Verification email sent. Check your inbox, then sign in.')
        return
      }
      const { data, error: signInError } = await supabase().auth.signInWithPassword({ email: email.trim(), password })
      if (signInError) throw signInError
      if (!data.user.email_confirmed_at) { await supabase().auth.signOut(); setError('Please verify your email address before signing in.'); return }
      const { data: profile, error: profileError } = await supabase().from('profiles').select('role').eq('id', data.user.id).single()
      if (profileError) throw profileError
      router.push(profile.role === 'Admin' ? '/admin' : '/dashboard')
      router.refresh()
    } catch (caught) {
      setError(authError(caught instanceof Error ? caught.message : 'Authentication failed'))
    } finally { setLoading(false) }
  }

  async function resendVerification() {
    setError(''); setNotice(''); setLoading(true)
    const { error: resendError } = await supabase().auth.resend({ type: 'signup', email: email.trim(), options: { emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback?next=/auth/success` } })
    setLoading(false)
    if (resendError) setError(authError(resendError.message)); else setNotice('A new verification email was sent. Check your inbox.')
  }

  return <main className="min-h-screen bg-[#f4f8ff] px-5 py-8 text-[#1d2a43] sm:py-12"><div className="mx-auto max-w-6xl"><Link href="/" className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-[#155bd5]"><ArrowLeft size={16} /> Back to home</Link><div className="grid overflow-hidden rounded-3xl bg-white shadow-[0_24px_70px_rgba(27,76,145,.12)] lg:grid-cols-[.9fr_1.1fr]"><section className="hidden bg-[#155bd5] p-12 text-white lg:block"><div className="mb-20 grid size-11 place-items-center rounded-xl bg-white/15 text-xl font-semibold">भे</div><p className="mb-4 text-sm font-bold uppercase tracking-[.18em] text-blue-100">Bhetaun भेटौँ</p><h1 className="max-w-sm text-4xl font-extrabold leading-tight">A better way to book your time.</h1><p className="mt-5 max-w-sm leading-7 text-blue-100">Join Nepal&apos;s growing appointment marketplace and connect with trusted local businesses.</p><div className="mt-12 space-y-4 text-sm text-blue-50"><p className="flex items-center gap-3"><span className="grid size-7 place-items-center rounded-full bg-white/15"><Check size={15} /></span> Easy, secure appointment booking</p><p className="flex items-center gap-3"><span className="grid size-7 place-items-center rounded-full bg-white/15"><Check size={15} /></span> Verified email accounts</p></div></section><section className="p-6 sm:p-10 lg:p-14"><div className="mb-8 flex rounded-xl bg-[#f3f6fb] p-1"><button type="button" onClick={() => { setMode('login'); setError(''); setNotice('') }} className={`flex-1 rounded-lg py-2.5 text-sm font-bold ${mode === 'login' ? 'bg-white text-[#155bd5] shadow-sm' : 'text-[#7a879d]'}`}>Log in</button><button type="button" onClick={() => { setMode('signup'); setError(''); setNotice('') }} className={`flex-1 rounded-lg py-2.5 text-sm font-bold ${mode === 'signup' ? 'bg-white text-[#155bd5] shadow-sm' : 'text-[#7a879d]'}`}>Sign up</button></div><h2 className="text-3xl font-extrabold text-[#172540]">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2><p className="mt-2 text-sm text-[#7a879b]">{mode === 'login' ? 'Log in to manage your Bhetaun appointments.' : 'Verify your email to start using Bhetaun.'}</p><form onSubmit={handleSubmit} className="mt-8 space-y-5">{mode === 'signup' && <><label className="block text-sm font-bold">Full name<input required value={fullName} onChange={(event) => setFullName(event.target.value)} className="mt-2 w-full rounded-xl border border-[#dce5f2] px-4 py-3 outline-none focus:border-[#155bd5]" placeholder="Your name" /></label><fieldset><legend className="text-sm font-bold">I am joining as</legend><div className="mt-2 grid grid-cols-2 gap-2">{[['customer','Customer'],['vendor','Vendor / Business Owner']].map(([value,label]) => <button key={value} type="button" onClick={() => setRole(value as 'customer' | 'vendor')} className={`rounded-xl border px-3 py-3 text-left text-sm font-semibold ${role === value ? 'border-[#155bd5] bg-[#edf4ff] text-[#155bd5]' : 'border-[#dce5f2] text-[#64728a]'}`}>{label}</button>)}</div></fieldset></>}<label className="block text-sm font-bold">Email address<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-[#dce5f2] px-4 py-3 outline-none focus:border-[#155bd5]" placeholder="you@example.com" /></label><label className="block text-sm font-bold">Password<div className="relative mt-2"><input required type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-[#dce5f2] px-4 py-3 pr-12 outline-none focus:border-[#155bd5]" placeholder="Your password" /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-[#7a879d]">{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button></div></label>{mode === 'signup' && <div className="grid grid-cols-2 gap-2 text-xs text-[#7a879d]">{passwordRules.map(([label, test]) => <span key={label} className={test(password) ? 'text-[#18845b]' : ''}>{test(password) ? '✓' : '○'} {label}</span>)}</div>}{error && <div role="alert" className="rounded-xl bg-[#fff1f1] px-4 py-3 text-sm font-semibold text-[#c43d3d]">{error}{error.includes('verify') && <button type="button" onClick={resendVerification} className="ml-2 underline">Resend email</button>}</div>}{notice && <div role="status" className="rounded-xl bg-[#edf9f3] px-4 py-3 text-sm font-semibold text-[#18845b]">{notice}{mode === 'signup' && !notice.includes('ready') && <button type="button" onClick={resendVerification} className="ml-2 underline">Resend</button>}</div>}<button disabled={loading} className="w-full rounded-xl bg-[#155bd5] py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(21,91,213,.2)] disabled:opacity-60">{loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}</button></form><Link href="/admin/login" className="mt-6 block text-center text-sm font-bold text-[#155bd5]">Admin Portal</Link></section></div></div></main>
}
