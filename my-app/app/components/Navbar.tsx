'use client'

import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="flex flex-wrap items-center justify-center gap-3 rounded-full bg-slate-950/90 px-4 py-3 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
      <Link
        href="/"
        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 shadow-[0_10px_30px_-20px_rgba(255,255,255,0.45)] transition duration-200 hover:border-cyan-400 hover:bg-cyan-500/10 hover:text-white"
      >
        Home
      </Link>
      <Link
        href="/about"
        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 shadow-[0_10px_30px_-20px_rgba(255,255,255,0.45)] transition duration-200 hover:border-amber-400 hover:bg-amber-500/10 hover:text-white"
      >
        About
      </Link>
      <Link
        href="/backoffice/dashboard"
        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 shadow-[0_10px_30px_-20px_rgba(255,255,255,0.45)] transition duration-200 hover:border-violet-400 hover:bg-violet-500/10 hover:text-white"
      >
        Dashboard
      </Link>
    </nav>
  )
}