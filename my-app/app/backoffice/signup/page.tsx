'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import axios from 'axios'
import Ferrofluid from '@/app/components/Ferrofluid'
import { Config } from './config'

export default function SignUp() {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSignUp = async () => {
    const trimmedName = name.trim()
    const trimmedUsername = username.trim()
    const trimmedPassword = password.trim()

    if (!trimmedName || !trimmedUsername || !trimmedPassword) {
      Swal.fire({
        title: 'Sign Up',
        text: 'กรุณากรอก name, username และ password',
        icon: 'warning',
        timer: 2000
      })
      return
    }

    try {
      const url = Config.apiUrl + '/members/signup'
      const payload = {
        name: trimmedName,
        username: trimmedUsername,
        password: trimmedPassword
      }

      const res = await axios.post(url, payload)

      if (res.status === 200) {
        localStorage.setItem('token', res.data.token)
        router.push('/backoffice/signin')
      }
    } catch (err: unknown) {
      Swal.fire({
        title: 'error',
        text: (err as Error).message,
        icon: 'error'
      })
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 z-0 h-screen w-full">
        <Ferrofluid
          colors={["#00040e","#152c95","#12154e"]}
          speed={0.5}
          scale={1}
          turbulence={1}
          fluidity={0.1}
          rimWidth={0.2}
          sharpness={3}
          shimmer={1}
          glow={2}
          flowDirection="down"
          opacity={1}
          mouseInteraction={true}
          mouseStrength={1}
          mouseRadius={0.3}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100vh', minHeight: '100vh' }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-3 sm:p-5">
        <div className="w-full max-w-[360px] rounded-[22px] border border-slate-700/70 bg-slate-900/85 p-5 sm:p-6 shadow-[8px_8px_0_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
          <div className="mb-5 flex flex-col gap-1 text-left">
            <p className="text-[25px] font-bold text-blue-200 text-center">Sign Up</p>
            <span className="text-xs sm:text-sm font-medium text-slate-400 text-center">sign up to continue</span>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <div className="mb-1 text-xs sm:text-sm text-slate-300">Name</div>
              <input
                placeholder="Enter your name"
                className="w-full rounded-2xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-white outline-none transition focus:border-cyan-400"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <div className="mb-1 text-xs sm:text-sm text-slate-300">Username</div>
              <input
                placeholder="Enter your username"
                className="w-full rounded-2xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-white outline-none transition focus:border-cyan-400"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <div className="mb-1 text-xs sm:text-sm text-slate-300">Password</div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-white outline-none transition focus:border-cyan-400"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-800/90 p-2 text-slate-300 transition hover:bg-slate-700"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4">
                      <path d="M17.94 17.94A10.97 10.97 0 0 0 21.03 12 10.97 10.97 0 0 0 17.94 6.06M6.06 6.06A10.97 10.97 0 0 0 2.97 12 10.97 10.97 0 0 0 6.06 17.94M9.88 9.88a3 3 0 0 1 4.24 4.24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M1 1l22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" fill="none" stroke="currentColor" strokeWidth="2" />
                      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <button
              className="relative mt-3 w-full overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-800 shadow-[3px_3px_0_0_rgba(255,255,255,0.15)] transition-all duration-300 before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-[#3b82f6] before:transition-all before:duration-300 hover:text-white hover:shadow-[3px_3px_0_0_rgba(59,130,246,0.35)] hover:before:w-full cursor-pointer"
              onClick={handleSignUp}
            >
              <span className="relative z-10 inline-flex items-center justify-center gap-2">
                <i className="fa fa-user-plus text-xs" />
                <span>Create Account</span>
              </span>
            </button>
            <button
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:bg-blue-900/50 hover:border-blue-500/50 cursor-pointer"
              onClick={() => router.push('/backoffice/signin')}
            >
              <span className="inline-flex items-center justify-center gap-2">
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                  <path
                    d="M15 3H16.2C17.8802 3 18.7202 3 19.362 3.32698C19.9265 3.6146 20.3854 4.07354 20.673 4.63803C21 5.27976 21 6.11985 21 7.8V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H15M10 7L15 12M15 12L10 17M15 12L3 12"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Go to Sign In</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}