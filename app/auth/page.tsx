'use client'

import Link from 'next/link'
import { useState, type FormEvent } from 'react'
import { ArrowLeft, Check, Eye, EyeOff, LockKeyhole, UserRound } from 'lucide-react'

const roles = [
  { id: 'customer', label: 'Customer', detail: 'Book and manage your appointments.' },
  { id: 'vendor', label: 'Vendor / Business Owner', detail: 'List your business and manage bookings.' },
  { id: 'admin', label: 'Admin', detail: 'Manage the Bhetaun marketplace.' },
]

const passwordRules = [
  { label: '9+ characters', test: (value: string) => value.length >= 9 },
  { label: 'Uppercase letter', test: (value: string) => /[A-Z]/.test(value) },
  { label: 'Lowercase letter', test: (value: string) => /[a-z]/.test(value) },
  { label: 'Number', test: (value: string) => /\d/.test(value) },
  { label: 'Special symbol', test: (value: string) => /[^A-Za-z0-9]/.test(value) },
]

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [role, setRole] = useState('customer')
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const validPassword = passwordRules.every((rule) => rule.test(password))

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (mode === 'signup' && !validPassword) return
    setSubmitted(true)
  }

  return <main className="min-h-screen bg-[#f4f8ff] px-5 py-8 text-[#1d2a43] sm:py-12"><div className="mx-auto max-w-6xl"><Link href="/" className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-[#155bd5]"><ArrowLeft size={16} /> Back to home</Link><div className="grid overflow-hidden rounded-3xl bg-white shadow-[0_24px_70px_rgba(27,76,145,.12)] lg:grid-cols-[.9fr_1.1fr]"><section className="hidden bg-[#155bd5] p-12 text-white lg:block"><div className="mb-20 grid size-11 place-items-center rounded-xl bg-white/15 text-xl font-semibold">भे</div><p className="mb-4 text-sm font-bold uppercase tracking-[.18em] text-blue-100">Bhetaun भेटौँ</p><h1 className="max-w-sm text-4xl font-extrabold leading-tight">A better way to book your time.</h1><p className="mt-5 max-w-sm leading-7 text-blue-100">Join Nepal&apos;s growing appointment marketplace and connect with trusted local businesses.</p><div className="mt-12 space-y-4 text-sm text-blue-50"><p className="flex items-center gap-3"><span className="grid size-7 place-items-center rounded-full bg-white/15"><Check size={15} /></span> Easy, secure appointment booking</p><p className="flex items-center gap-3"><span className="grid size-7 place-items-center rounded-full bg-white/15"><Check size={15} /></span> Trusted and verified businesses</p></div></section><section className="p-6 sm:p-10 lg:p-14"><div className="mb-8 flex rounded-xl bg-[#f3f6fb] p-1"><button type="button" onClick={() => { setMode('login'); setSubmitted(false) }} className={`flex-1 rounded-lg py-2.5 text-sm font-bold ${mode === 'login' ? 'bg-white text-[#155bd5] shadow-sm' : 'text-[#7a879d]'}`}>Log in</button><button type="button" onClick={() => { setMode('signup'); setSubmitted(false) }} className={`flex-1 rounded-lg py-2.5 text-sm font-bold ${mode === 'signup' ? 'bg-white text-[#155bd5] shadow-sm' : 'text-[#7a879d]'}`}>Sign up</button></div><h2 className="text-3xl font-extrabold text-[#172540]">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2><p className="mt-2 text-sm text-[#7d899d]">{mode === 'login' ? 'Log in to manage your Bhetaun appointments.' : 'Choose your role to get started with Bhetaun.'}</p><div className="mt-7 grid gap-2 sm:grid-cols-3">{roles.map((item) => <button type="button" key={item.id} onClick={() => setRole(item.id)} className={`rounded-xl border p-3 text-left transition ${role === item.id ? 'border-[#155bd5] bg-[#edf4ff] ring-1 ring-[#155bd5]' : 'border-[#e1e8f3] hover:border-[#9bbcf4]'}`}><span className="block text-xs font-extrabold text-[#263654]">{item.label}</span><span className="mt-1 block text-[10px] leading-4 text-[#8190a7]">{item.detail}</span></button>)}</div><form onSubmit={handleSubmit} className="mt-7 space-y-4"><label className="block"><span className="mb-2 block text-sm font-semibold text-[#33425e]">Username or email</span><div className="flex items-center gap-3 rounded-xl border border-[#dfe7f3] px-4 py-3"><UserRound size={17} className="text-[#8d9ab0]" /><input required type="text" autoComplete="username" placeholder="you@example.com" className="w-full bg-transparent text-sm outline-none" /></div></label>{mode === 'signup' && <label className="block"><span className="mb-2 block text-sm font-semibold text-[#33425e]">Full name</span><input required type="text" placeholder="Your full name" className="w-full rounded-xl border border-[#dfe7f3] px-4 py-3 text-sm outline-none focus:border-[#155bd5]" /></label>}<label className="block"><span className="mb-2 block text-sm font-semibold text-[#33425e]">Password</span><div className="flex items-center gap-3 rounded-xl border border-[#dfe7f3] px-4 py-3"><LockKeyhole size={17} className="text-[#8d9ab0]" /><input required type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => { setPassword(event.target.value); setSubmitted(false) }} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} placeholder="Enter your password" className="w-full bg-transparent text-sm outline-none" /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((value) => !value)} className="text-[#7d899d] hover:text-[#155bd5]">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>{mode === 'signup' && <div className="rounded-xl bg-[#f7faff] p-3"><p className="text-xs font-bold text-[#52607a]">Password must include:</p><div className="mt-2 grid grid-cols-2 gap-2 text-xs">{passwordRules.map((rule) => <span key={rule.label} className={rule.test(password) ? 'text-[#2e9d7f]' : 'text-[#8793a7]'}>{rule.test(password) ? '✓' : '○'} {rule.label}</span>)}</div></div>}<button type="submit" className="w-full rounded-xl bg-[#155bd5] py-3.5 text-sm font-bold text-white transition hover:bg-[#104bb5]">{mode === 'login' ? `Log in as ${roles.find((item) => item.id === role)?.label}` : `Create ${roles.find((item) => item.id === role)?.label} account`}</button>{submitted && <p role="status" className="rounded-xl bg-[#eaf8f4] px-4 py-3 text-sm font-semibold text-[#267f69]">{mode === 'login' ? 'Login details submitted.' : 'Registration details submitted.'}</p>}</form></section></div></div></main>
}
