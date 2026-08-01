'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Config } from '../backoffice/signup/config'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import BorderGlow from './BorderGlow'

export default function Sidebar() {
  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const router = useRouter()

  const fetchData = async () => {
    try {
      const url = Config.apiUrl + '/members/info'
      const token = localStorage.getItem('token')

      if (!token) {
        router.push('/backoffice/signin')
        return
      }

      const headers = {
        'Authorization': 'Bearer ' + token
      }

      const res = await axios.get(url, { headers })

      if (res.status === 200) {
        const fetchedName = res.data.name || res.data.result?.name || res.data.user?.name
        if (fetchedName) {
          setName(fetchedName)
        }
        if (res.data.image) {
          setImage(res.data.image)
          setPreviewImage(null)
        }
      }
    } catch (err) {
      console.error('Fetch error:', err)
    }
  }

  useEffect(() => {
    fetchData()
    const handleProfileUpdate = () => {
      setPreviewImage(null)
      fetchData()
    }
    const handleProfilePreview = (e: Event) => {
      const customEvent = e as CustomEvent
      if (customEvent.detail && customEvent.detail.previewUrl) {
        setPreviewImage(customEvent.detail.previewUrl)
      }
    }
    window.addEventListener('profile-updated', handleProfileUpdate)
    window.addEventListener('profile-preview', handleProfilePreview)
    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdate)
      window.removeEventListener('profile-preview', handleProfilePreview)
    }
  }, [])

  const signOut = async () => {
    const confirmButton = await Swal.fire({
      title: 'Signout',
      text: 'คุณต้องการออกจากระบบใช่ไหม',
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    })

    if (confirmButton.isConfirmed) {
      localStorage.removeItem('token')
      router.push('/backoffice/signin')
    }
  }

  return (
    <BorderGlow
      edgeSensitivity={30}
      glowColor="260 80 70"
      backgroundColor="#080812"
      borderRadius={24}
      glowRadius={32}
      glowIntensity={1.2}
      coneSpread={28}
      animated={false}
      colors={['#7c3aed', '#ec4899', '#38bdf8']}
      className="h-full w-full"
    >
      <div className="flex h-full w-full flex-col justify-between overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/90 p-3 shadow-2xl shadow-slate-950/40 sm:p-4 lg:p-5">
        <div className="flex h-full flex-col justify-between">
          <div>
            {/* Header */}
            <div className="mb-2 text-center text-sm font-bold tracking-wide sm:mb-3 sm:text-base lg:text-lg">
              <Link
                href="/backoffice/home"
                className="text-slate-100 transition hover:text-sky-400 hover:opacity-90 active:scale-95 inline-block"
              >
                Todo List
              </Link>
            </div>

            {/* Profile Section */}
            <div className="mb-2 flex flex-col items-center justify-center gap-2 sm:mb-3 lg:mb-4">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-sky-400/30 bg-slate-900/80 text-lg text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.2)] overflow-hidden sm:h-12 sm:w-12 lg:h-14 lg:w-14 lg:text-xl">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile Avatar Preview"
                    className="h-full w-full object-cover"
                  />
                ) : image ? (
                  <img
                    src={`${Config.apiUrl}/uploads/${image}`}
                    alt="Profile Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <i className="fa fa-user" />
                )}
              </div>
              <span className="mt-1 text-center text-[11px] font-medium text-slate-200 sm:text-xs lg:text-sm">
                {name || 'กำลังโหลด...'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="mb-2 grid grid-cols-2 gap-1.5 sm:mb-3 lg:mb-4 lg:gap-2">
              <button
                type="button"
                onClick={() => router.push('/backoffice/home/profile')}
                className="flex items-center justify-center gap-1 rounded-xl border border-sky-400/40 bg-sky-500/10 px-1.5 py-2 text-[10px] font-medium text-sky-200 transition duration-200 hover:border-sky-300 hover:bg-sky-400/20 active:scale-95 sm:px-2 sm:py-2 sm:text-xs lg:px-2.5"
              >
                <i className="fa fa-pencil" />
                Edit
              </button>
              <button
                type="button"
                onClick={signOut}
                className="flex items-center justify-center gap-1 rounded-xl border border-rose-400/40 bg-rose-500/10 px-1.5 py-2 text-[10px] font-medium text-rose-200 transition duration-200 hover:border-rose-300 hover:bg-rose-400/20 active:scale-95 sm:px-2 sm:py-2 sm:text-xs lg:px-2.5"
              >
                <i className="fa fa-times" />
                Logout
              </button>
            </div>

            {/* Navigation Links */}
            <div className="space-y-1.5 sm:space-y-2">
              <Link
                href="/backoffice/home/dashboard"
                className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/60 px-2 py-2 text-xs text-slate-200 transition duration-200 hover:-translate-y-0.5 hover:border-sky-400/50 hover:bg-slate-900/90 hover:text-white sm:px-2.5 sm:py-2.5 sm:text-sm lg:px-3"
              >
                <span className="flex items-center gap-3">
                  <i className="fa fa-file-alt w-4 text-center text-sky-400" />
                  Dashboard
                </span>
                <span className="text-slate-500">›</span>
              </Link>
              <Link
                href="/backoffice/home/todo"
                className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/60 px-2 py-2 text-xs text-slate-200 transition duration-200 hover:-translate-y-0.5 hover:border-sky-400/50 hover:bg-slate-900/90 hover:text-white sm:px-2.5 sm:py-2.5 sm:text-sm lg:px-3"
              >
                <span className="flex items-center gap-3">
                  <i className="fa fa-list w-4 text-center text-sky-400" />
                  บันทึกงาน
                </span>
                <span className="text-slate-500">›</span>
              </Link>
              <Link
                href="/backoffice/home/report"
                className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/60 px-2 py-2 text-xs text-slate-200 transition duration-200 hover:-translate-y-0.5 hover:border-sky-400/50 hover:bg-slate-900/90 hover:text-white sm:px-2.5 sm:py-2.5 sm:text-sm lg:px-3"
              >
                <span className="flex items-center gap-3">
                  <i className="fa fa-chart-bar w-4 text-center text-sky-400" />
                  รายงานสรุป
                </span>
                <span className="text-slate-500">›</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </BorderGlow>
  )
}