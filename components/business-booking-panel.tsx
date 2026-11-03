'use client'

import { useState } from 'react'
import { CalendarDays, Check, Clock3 } from 'lucide-react'
import type { Service } from '@/lib/businesses'

export function BusinessBookingPanel({ services }: { services: Service[] }) {
  const [selectedService, setSelectedService] = useState(services[0]?.name ?? '')
  const [selectedTime, setSelectedTime] = useState('10:30 AM')
  const [confirmed, setConfirmed] = useState(false)
  const times = ['9:00 AM', '10:30 AM', '12:00 PM', '2:30 PM', '4:00 PM']

  return <div className="rounded-3xl bg-[#f4f8ff] p-5 ring-1 ring-[#e3ebf8] sm:p-7"><div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-white text-[#155bd5] shadow-sm"><CalendarDays size={19} /></div><div><h2 className="font-extrabold text-[#1d2a43]">Choose your appointment</h2><p className="text-sm text-[#7b879b]">Select a service, date and time</p></div></div><label className="mt-6 block"><span className="text-xs font-bold uppercase tracking-wider text-[#8290a7]">Service</span><select aria-label="Choose a service" value={selectedService} onChange={(event) => setSelectedService(event.target.value)} className="mt-2 w-full rounded-xl border-0 bg-white px-4 py-3 text-sm font-semibold text-[#1d2a43] outline-none ring-1 ring-[#dfe7f3]">{services.map((service) => <option key={service.name}>{service.name}</option>)}</select></label><label className="mt-4 block"><span className="text-xs font-bold uppercase tracking-wider text-[#8290a7]">Date</span><input aria-label="Choose a date" type="date" className="mt-2 w-full rounded-xl border-0 bg-white px-4 py-3 text-sm font-semibold text-[#1d2a43] outline-none ring-1 ring-[#dfe7f3]" /></label><div className="mt-4"><span className="text-xs font-bold uppercase tracking-wider text-[#8290a7]">Available times</span><div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">{times.map((time) => <button type="button" key={time} onClick={() => setSelectedTime(time)} className={`rounded-xl px-2 py-2.5 text-xs font-bold transition ${selectedTime === time ? 'bg-[#155bd5] text-white' : 'bg-white text-[#155bd5] ring-1 ring-[#dfe7f3] hover:bg-[#edf4ff]'}`}>{time}</button>)}</div></div><button type="button" onClick={() => setConfirmed(true)} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#155bd5] py-3.5 text-sm font-bold text-white hover:bg-[#104bb5]">{confirmed ? <><Check size={17} /> Request sent</> : <>Continue with {selectedTime} <Clock3 size={17} /></>}</button>{confirmed && <p className="mt-3 text-center text-xs font-semibold text-[#2eab89]">Your appointment request is ready for confirmation.</p>}</div>
}
