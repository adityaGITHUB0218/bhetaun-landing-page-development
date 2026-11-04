'use client'

import { useState } from 'react'
import { Bot, ChevronDown, MessageCircle, Send, X } from 'lucide-react'

const quickQuestions = [
  ['What is Bhetaun?', 'Bhetaun helps you discover trusted local businesses and book appointments in one place.'],
  ['How can I book an appointment?', 'Search for a business, open its profile, choose a service, date and time, then confirm your booking.'],
  ['How can I find a business?', 'Use Explore businesses or the search bar to filter businesses by name, category or location.'],
  ['How can I cancel an appointment?', 'Open My Appointments, select the appointment and choose Cancel.'],
  ['How can I register my business?', 'Choose Get started, select Vendor / Business Owner, and complete the registration form.'],
  ['How can I contact Bhetaun?', 'Email hello@bhetaun.com or use the contact links in the footer.'],
] as const

export default function BhetaunAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<{ from: 'bot' | 'user'; text: string }[]>([
    { from: 'bot', text: 'Hi, I\'m Bhetaun Assistant. How can I help?' },
  ])
  const [input, setInput] = useState('')

  function sendMessage(text = input) {
    const trimmed = text.trim()
    if (!trimmed) return
    const match = quickQuestions.find(([question]) => trimmed.toLowerCase() === question.toLowerCase())
    setMessages((current) => [...current, { from: 'user', text: trimmed }, { from: 'bot', text: match?.[1] ?? 'I can help with bookings, finding businesses, business registration and contacting Bhetaun. Choose a question below or try asking in another way.' }])
    setInput('')
  }

  return <>
    {open && <section className="fixed inset-x-4 bottom-20 z-50 flex max-h-[min(620px,calc(100vh-112px))] flex-col overflow-hidden rounded-2xl border border-[#dce7f6] bg-white shadow-[0_22px_70px_rgba(19,57,112,.24)] sm:inset-x-auto sm:right-5 sm:w-[380px]" aria-label="Bhetaun Assistant chat window"><div className="flex items-center justify-between bg-[#155bd5] px-4 py-3 text-white"><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-xl bg-white/15"><Bot size={19} /></span><div><p className="text-sm font-bold">Bhetaun Assistant</p><p className="text-[11px] text-blue-100">Here to help you find your next appointment</p></div></div><button onClick={() => setOpen(false)} className="rounded-lg p-1.5 hover:bg-white/15" aria-label="Close chatbot"><X size={18} /></button></div><div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">{messages.map((message, index) => <div key={`${message.text}-${index}`} className={`flex ${message.from === 'user' ? 'justify-end' : 'justify-start'}`}><p className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 text-sm leading-5 ${message.from === 'user' ? 'rounded-br-md bg-[#155bd5] text-white' : 'rounded-bl-md bg-[#f1f6ff] text-[#31415f]'}`}>{message.text}</p></div>)}<div className="flex flex-wrap gap-2 pt-1">{quickQuestions.map(([question]) => <button key={question} onClick={() => sendMessage(question)} className="rounded-full border border-[#d7e4f8] px-3 py-1.5 text-left text-[11px] font-semibold text-[#155bd5] hover:bg-[#f1f6ff]">{question}</button>)}</div></div><form onSubmit={(event) => { event.preventDefault(); sendMessage() }} className="flex gap-2 border-t border-[#e8eef7] p-3"><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask Bhetaun Assistant" aria-label="Message Bhetaun Assistant" className="min-w-0 flex-1 rounded-xl bg-[#f5f8fd] px-3 py-2.5 text-sm text-[#253652] outline-none ring-[#155bd5] placeholder:text-[#99a7bd] focus:ring-2" /><button type="submit" className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#155bd5] text-white hover:bg-[#104bb5]" aria-label="Send message"><Send size={17} /></button></form></section>}
    <button onClick={() => setOpen((current) => !current)} className="fixed bottom-4 right-4 z-50 grid size-14 place-items-center rounded-full bg-[#155bd5] text-white shadow-[0_12px_28px_rgba(21,91,213,.3)] transition hover:scale-105 hover:bg-[#104bb5] sm:right-6" aria-label={open ? 'Close Bhetaun Assistant' : 'Open Bhetaun Assistant'}>{open ? <ChevronDown size={24} /> : <MessageCircle size={24} />}</button>
  </>
}
