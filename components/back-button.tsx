'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function BackButton({ fallback = '/' }: { fallback?: string }) {
  const router = useRouter()
  return <button type="button" onClick={() => window.history.length > 1 ? router.back() : router.push(fallback)} className="inline-flex items-center gap-2 text-sm font-bold text-[#155bd5] transition hover:text-[#0f4fbd]"><ArrowLeft size={16} /> Back</button>
}
