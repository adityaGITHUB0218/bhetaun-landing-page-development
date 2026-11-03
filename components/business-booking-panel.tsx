'use client'

import { useMemo, useState } from 'react'
import { CalendarDays, Check, Clock3 } from 'lucide-react'
import type { Service } from '@/lib/businesses'

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const slotHours = ['9:00 AM – 10:00 AM', '10:00 AM – 11:00 AM', '11:00 AM – 12:00 PM', '12:00 PM – 1:00 PM', '2:00 PM – 3:00 PM', '3:00 PM – 4:00 PM', '4:00 PM – 5:00 PM']

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

export function BusinessBookingPanel({ services }: { services: Service[] }) {
  const today = new Date()
  const [selectedService, setSelectedService] = useState(services[0]?.name ?? '')
  const [selectedDate, setSelectedDate] = useState(toDateKey(today))
  const [selectedTime, setSelectedTime] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const dates = useMemo(() => Array.from({ length: 14 }, (_, index) => { const date = new Date(today); date.setDate(today.getDate() + index); return date }), [])
  const unavailable = new Set(['9:00 AM – 10:00 AM', '12:00 PM – 1:00 PM'])
  const availableSlots = dates.find((date) => toDateKey(date) === selectedDate)?.getDay() === 0 ? [] : slotHours.filter((slot) => !unavailable.has(slot))

  return <div className="rounded-3xl bg-[#f4f8ff] p-5 ring-1 ring-[#e3ebf8] sm:p-7"><div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-white text-[#155bd5] shadow-sm"><CalendarDays size={19} /></div><div><h2 className="font-extrabold text-[#1d2a43]">Choose your appointment</h2><p className="text-sm text-[#7b879b]">Select a service, date and available time</p></div></div><label className="mt-6 block"><span className="text-xs font-bold uppercase tracking-wider text-[#8290a7]">Service</span><select aria-label="Choose a service" value={selectedService} onChange={(event) => { setSelectedService(event.target.value); setConfirmed(false) }} className="mt-2 w-full rounded-xl border-0 bg-white px-4 py-3 text-sm font-semibold text-[#1d2a43] outline-none ring-1 ring-[#dfe7f3]">{services.map((service) => <option key={service.name}>{service.name}</option>)}</select></label><div className="mt-5"><span className="text-xs font-bold uppercase tracking-wider text-[#8290a7]">Choose a date</span><div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-7">{dates.map((date) => { const key = toDateKey(date); const active = key === selectedDate; return <button type="button" key={key} onClick={() => { setSelectedDate(key); setSelectedTime(''); setConfirmed(false) }} className={`rounded-xl px-2 py-3 text-center transition ${active ? 'bg-[#155bd5] text-white' : 'bg-white text-[#33425e] ring-1 ring-[#dfe7f3] hover:bg-[#edf4ff]'}`}><span className="block text-[10px] font-bold uppercase opacity-70">{dayNames[date.getDay()]}</span><span className="mt-1 block text-lg font-extrabold">{date.getDate()}</span><span className="block text-[10px] opacity-70">{date.toLocaleString('en-US', { month: 'short' })}</span></button> })}</div></div><div className="mt-5"><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-wider text-[#8290a7]">Available one-hour slots</span><span className="text-xs text-[#7b879b]">{availableSlots.length} available</span></div>{availableSlots.length > 0 ? <div className="mt-2 grid gap-2 sm:grid-cols-2">{availableSlots.map((slot) => <button type="button" key={slot} onClick={() => { setSelectedTime(slot); setConfirmed(false) }} className={`flex items-center justify-between rounded-xl px-3 py-3 text-left text-xs font-bold transition ${selectedTime === slot ? 'bg-[#155bd5] text-white' : 'bg-white text-[#155bd5] ring-1 ring-[#dfe7f3] hover:bg-[#edf4ff]'}`}><span>{slot}</span><Clock3 size={15} /></button>)}</div> : <p className="mt-2 rounded-xl bg-white p-4 text-sm text-[#7b879b]">This business is closed on Sundays. Please select another date.</p>}</div><button type="button" disabled={!selectedTime} onClick={() => setConfirmed(true)} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#155bd5] py-3.5 text-sm font-bold text-white hover:bg-[#104bb5] disabled:cursor-not-allowed disabled:opacity-50">{confirmed ? <><Check size={17} /> Appointment request saved</> : <>Continue with {selectedTime || 'a time'} <Clock3 size={17} /></>}</button>{confirmed && <p className="mt-3 rounded-xl bg-[#eaf8f4] px-4 py-3 text-center text-xs font-semibold text-[#2e9377]">Your sample booking is confirmed for {selectedDate} at {selectedTime}.</p>}</div>
}
