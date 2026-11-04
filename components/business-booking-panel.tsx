'use client'

import { useMemo, useState } from 'react'
import { CalendarDays, Check, ChevronLeft, ChevronRight, Clock3 } from 'lucide-react'
import type { Service } from '@/lib/businesses'

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const slotHours = ['9:00 AM – 10:00 AM', '10:00 AM – 11:00 AM', '11:00 AM – 12:00 PM', '12:00 PM – 1:00 PM', '2:00 PM – 3:00 PM', '3:00 PM – 4:00 PM', '4:00 PM – 5:00 PM']

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function BusinessBookingPanel({ services }: { services: Service[] }) {
  const today = startOfDay(new Date())
  const [selectedService, setSelectedService] = useState(services[0]?.name ?? '')
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDate, setSelectedDate] = useState(dateKey(today))
  const [selectedTime, setSelectedTime] = useState('')
  const [message, setMessage] = useState('')
  const calendarDays = useMemo(() => {
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1)
    const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0)
    return Array.from({ length: firstDay.getDay() + lastDay.getDate() }, (_, index) => index < firstDay.getDay() ? null : new Date(month.getFullYear(), month.getMonth(), index - firstDay.getDay() + 1))
  }, [month])
  const selected = new Date(`${selectedDate}T00:00:00`)
  const availableSlots = selected.getDay() === 0 ? [] : slotHours.filter((_, index) => !(selected.getDay() === 6 && index > 4))
  const monthLabel = month.toLocaleString('en-US', { month: 'long', year: 'numeric' })

  function chooseDate(date: Date) {
    if (startOfDay(date) < today) return
    setSelectedDate(dateKey(date))
    setSelectedTime('')
    setMessage('')
  }

  function bookNow() {
    if (!selectedService || !selectedDate || !selectedTime) {
      setMessage('Please select a service, date and available time slot.')
      return
    }
    setMessage(`Booking request ready for ${selectedService} on ${selectedDate} at ${selectedTime}.`)
  }

  return <div className="rounded-3xl bg-[#f4f8ff] p-5 ring-1 ring-[#e3ebf8] sm:p-7"><div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-white text-[#155bd5] shadow-sm"><CalendarDays size={19} /></div><div><h2 className="font-extrabold text-[#1d2a43]">Choose your appointment</h2><p className="text-sm text-[#7b879b]">Select a service, date and available time</p></div></div><label className="mt-6 block"><span className="text-xs font-bold uppercase tracking-wider text-[#8290a7]">Service</span><select aria-label="Choose a service" value={selectedService} onChange={(event) => { setSelectedService(event.target.value); setMessage('') }} className="mt-2 w-full rounded-xl border-0 bg-white px-4 py-3 text-sm font-semibold text-[#1d2a43] outline-none ring-1 ring-[#dfe7f3]">{services.map((service) => <option key={service.name}>{service.name}</option>)}</select></label><div className="mt-5"><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-wider text-[#8290a7]">Choose a date</span><div className="flex items-center gap-1"><button type="button" aria-label="Previous month" disabled={month.getFullYear() === today.getFullYear() && month.getMonth() === today.getMonth()} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="rounded-lg p-1.5 text-[#155bd5] disabled:cursor-not-allowed disabled:opacity-30"><ChevronLeft size={17} /></button><span className="min-w-32 text-center text-sm font-bold text-[#33425e]">{monthLabel}</span><button type="button" aria-label="Next month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="rounded-lg p-1.5 text-[#155bd5]"><ChevronRight size={17} /></button></div></div><div className="mt-3 grid grid-cols-7 gap-1.5 text-center text-[10px] font-bold uppercase text-[#94a0b2]">{dayNames.map((day) => <span key={day}>{day}</span>)}</div><div className="mt-2 grid grid-cols-7 gap-1.5">{calendarDays.map((date, index) => date ? <button type="button" key={dateKey(date)} disabled={startOfDay(date) < today} onClick={() => chooseDate(date)} className={`min-h-10 rounded-xl text-sm font-bold transition sm:min-h-11 ${dateKey(date) === selectedDate ? 'bg-[#155bd5] text-white' : startOfDay(date) < today ? 'cursor-not-allowed text-[#c4cad4]' : 'bg-white text-[#33425e] ring-1 ring-[#dfe7f3] hover:bg-[#edf4ff]'}`}>{date.getDate()}</button> : <span key={`empty-${index}`} />)}</div></div><div className="mt-5"><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-wider text-[#8290a7]">Available one-hour slots</span><Clock3 size={16} className="text-[#155bd5]" /></div><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">{availableSlots.length ? availableSlots.map((time) => <button type="button" key={time} onClick={() => { setSelectedTime(time); setMessage('') }} className={`rounded-xl px-2 py-3 text-xs font-bold transition ${selectedTime === time ? 'bg-[#155bd5] text-white' : 'bg-white text-[#155bd5] ring-1 ring-[#dfe7f3] hover:bg-[#155bd5] hover:text-white'}`}>{time}</button>) : <p className="col-span-full rounded-xl bg-white p-4 text-sm text-[#7b879b]">No slots available on Sundays. Choose another date.</p>}</div></div><button type="button" onClick={bookNow} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#155bd5] py-3.5 text-sm font-bold text-white transition hover:bg-[#104bb5]"><Check size={17} /> Book Now</button>{message && <p role="status" className="mt-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#155bd5]">{message}</p>}</div>
}
