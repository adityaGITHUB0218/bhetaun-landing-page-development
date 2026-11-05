import Link from 'next/link'

export default function AuthSuccessPage() {
  return <main className="grid min-h-screen place-items-center bg-[#f4f8ff] px-5"><section className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-[0_24px_70px_rgba(27,76,145,.12)]"><div className="mx-auto grid size-14 place-items-center rounded-full bg-[#edf9f3] text-2xl text-[#18845b]">✓</div><h1 className="mt-6 text-3xl font-extrabold text-[#172540]">Email verified</h1><p className="mt-3 text-sm leading-6 text-[#71809a]">Your Bhetaun account is ready. Log in to continue.</p><Link href="/auth" className="mt-7 inline-flex rounded-xl bg-[#155bd5] px-6 py-3 text-sm font-bold text-white">Continue to login</Link></section></main>
}
