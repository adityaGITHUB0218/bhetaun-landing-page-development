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
  if (normalized.includes('rate limit') || normalized.includes('too many')) return 'Too many attempts. Wait for the Supabase cooldown to expire before trying again.'
  if (normalized.includes('cancel') || normalized.includes('access_denied')) return 'Sign-in was cancelled. Choose a provider to try again.'
  if (normalized.includes('network') || normalized.includes('fetch')) return 'We could not reach Supabase. Check your connection and try again.'
  return 'We could not complete that request. Please try again.'
}

const redirectUrl = () => process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback?next=/auth/success`

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
    if (loading) return
    setError(''); setNotice('')
    if (mode === 'signup' && !validPassword) { setError('Choose a password that meets every requirement.'); return }
    setLoading(true)
    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase().auth.signUp({
          email: email.trim(), password,
          options: { emailRedirectTo: redirectUrl(), data: { full_name: fullName.trim(), role: role === 'vendor' ? 'Vendor / Business Owner' : 'Customer' } },
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

  async function handleSocial(provider: 'google' | 'facebook' | 'twitter') {
    if (loading) return
    setError(''); setNotice(''); setLoading(true)
    const { error: oauthError } = await supabase().auth.signInWithOAuth({ provider, options: { redirectTo: redirectUrl() } })
    if (oauthError) { setError(authError(oauthError.message)); setLoading(false) }
  }

  async function resendVerification() {
    if (loading) return
    setError(''); setNotice(''); setLoading(true)
    const { error: resendError } = await supabase().auth.resend({ type: 'signup', email: email.trim(), options: { emailRedirectTo: redirectUrl() } })
    setLoading(false)
    if (resendError) setError(authError(resendError.message)); else setNotice('A new verification email was sent. Check your inbox.')
  }

  return <main className="min-h-screen bg-[#f4f8ff] px-5 py-8 text-[#1d2a43] sm:py-12"><div className="mx-auto max-w-6xl"><Link href="/" className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-[#155bd5]"><ArrowLeft size={16} /> Back to home</Link><div className="grid overflow-hidden rounded-3xl bg-white shadow-[0_24px_70px_rgba(27,76,145,.12)] lg:grid-cols-[.9fr_1.1fr]"><section className="hidden bg-[#155bd5] p-12 text-white lg:block"><div className="mb-20 grid size-11 place-items-center rounded-xl bg-white/15 text-xl font-semibold">भे</div><p className="mb-4 text-sm font-bold uppercase tracking-[.18em] text-blue-100">Bhetaun भेटौँ</p><h1 className="max-w-sm text-4xl font-extrabold leading-tight">A better way to book your time.</h1><p className="mt-5 max-w-sm leading-7 text-blue-100">Join Nepal&apos;s growing appointment marketplace and connect with trusted local businesses.</p><div className="mt-12 space-y-4 text-sm text-blue-50"><p className="flex items-center gap-3"><span className="grid size-7 place-items-center rounded-full bg-white/15"><Check size={15} /></span> Easy, secure appointment booking</p><p className="flex items-center gap-3"><span className="grid size-7 place-items-center rounded-full bg-white/15"><Check size={15} /></span> Verified email accounts</p></div></section><section className="p-6 sm:p-10 lg:p-14"><div className="mb-8 flex rounded-xl bg-[#f3f6fb] p-1"><button type="button" onClick={() => { setMode('login'); setError(''); setNotice('') }} className={`flex-1 rounded-lg py-2.5 text-sm font-bold ${mode === 'login' ? 'bg-white text-[#155bd5] shadow-sm' : 'text-[#7a879d]'}`}>Log in</button><button type="button" onClick={() => { setMode('signup'); setError(''); setNotice('') }} className={`flex-1 rounded-lg py-2.5 text-sm font-bold ${mode === 'signup' ? 'bg-white text-[#155bd5] shadow-sm' : 'text-[#7a879d]'}`}>Sign up</button></div><h2 className="text-3xl font-extrabold text-[#172540]">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2><p className="mt-2 text-sm text-[#71809a]">{mode === 'login' ? 'Log in to manage your appointments.' : 'Start booking trusted local services today.'}</p><div className="mt-7 grid gap-3 sm:grid-cols-3"><button type="button" disabled={loading} onClick={() => handleSocial('google')} className="flex items-center justify-center gap-2 rounded-xl border border-[#dce5f2] py-3 text-sm font-bold text-[#25314a] transition hover:border-[#155bd5] disabled:opacity-60"><span className="font-black text-[#4285f4]">G</span> Google</button><button type="button" disabled={loading} onClick={() => handleSocial('facebook')} className="flex items-center justify-center gap-2 rounded-xl border border-[#dce5f2] py-3 text-sm font-bold text-[#25314a] transition hover:border-[#155bd5] disabled:opacity-60"><span className="font-black text-[#1877f2]">f</span> Facebook</button><button type="button" disabled={loading} onClick={() => handleSocial('twitter')} className="flex items-center justify-center gap-2 rounded-xl border border-[#dce5f2] py-3 text-sm font-bold text-[#25314a] transition hover:border-[#155bd5] disabled:opacity-60"><span className="font-black text-[#111827]">X</span> Continue</button></div><div className="my-7 flex items-center gap-3 text-xs font-semibold text-[#9aa6b9]"><span className="h-px flex-1 bg-[#e5ebf3]" /> Or continue with email <span className="h-px flex-1 bg-[#e5ebf3]" /></div><form onSubmit={handleSubmit} className="space-y-5">{mode === 'signup' && <><label className="block text-sm font-bold">Full name<input required value={fullName} onChange={(event) => setFullName(event.target.value)} className="mt-2 w-full rounded-xl border border-[#dce5f2] px-4 py-3 outline-none focus:border-[#155bd5]" placeholder="Your name" /></label><fieldset><legend className="text-sm font-bold">I am joining as</legend><div className="mt-2 grid grid-cols-2 gap-3"><label className={`cursor-pointer rounded-xl border p-3 text-sm ${role === 'customer' ? 'border-[#155bd5] bg-[#edf4ff]' : 'border-[#dce5f2]'}`}><input className="sr-only" type="radio" checked={role === 'customer'} onChange={() => setRole('customer')} />Customer</label><label className={`cursor-pointer rounded-xl border p-3 text-sm ${role === 'vendor' ? 'border-[#155bd5] bg-[#edf4ff]' : 'border-[#dce5f2]'}`}><input className="sr-only" type="radio" checked={role === 'vendor'} onChange={() => setRole('vendor')} />Vendor / business</label></div></fieldset></>}<label className="block text-sm font-bold">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-[#dce5f2] px-4 py-3 outline-none focus:border-[#155bd5]" placeholder="you@example.com" /></label><label className="block text-sm font-bold">Password<div className="relative mt-2"><input required type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-[#dce5f2] px-4 py-3 pr-12 outline-none focus:border-[#155bd5]" placeholder="••••••••" /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-3 text-[#7a879d]">{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button></div></label>{mode === 'signup' && <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#f7f9fc] p-3 text-xs text-[#71809a]">{passwordRules.map(([label, test]) => <span key={label} className={test(password) ? 'font-semibold text-[#18845b]' : ''}>{test(password) ? '✓' : '○'} {label}</span>)}</div>}{error && <div role="alert" className="rounded-xl bg-[#fff1f1] px-4 py-3 text-sm font-semibold text-[#c43d3d]">{error}{error.includes('verify') && <button type="button" onClick={resendVerification} className="ml-2 underline">Resend</button>}</div>}{notice && <p role="status" className="rounded-xl bg-[#edf9f3] px-4 py-3 text-sm font-semibold text-[#18845b]">{notice}</p>}<button disabled={loading} className="w-full rounded-xl bg-[#155bd5] py-3.5 text-sm font-bold text-white transition hover:bg-[#0f4fbd] disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}</button></form><p className="mt-7 text-center text-xs leading-5 text-[#8b97aa]">By continuing, you agree to Bhetaun&apos;s Terms and Privacy Policy.</p></section></div></div></main>
}
