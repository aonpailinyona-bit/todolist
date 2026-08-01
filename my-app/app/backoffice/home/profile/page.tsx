'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Config } from '../../signup/config'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import BorderGlow from '../../../components/BorderGlow'

export default function Profile() {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [image, setImage] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
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
        setName(res.data.name || '')
        setUsername(res.data.username || '')
        if (res.data.image) {
          setImage(res.data.image)
        }
      }
    } catch (err) {
      console.error('Fetch profile error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      // Broadcast instant preview URL to Sidebar
      window.dispatchEvent(new CustomEvent('profile-preview', { detail: { previewUrl: url } }))
    }
  }

  const handleSave = async () => {
    try {
      if (password && password !== confirmPassword) {
        Swal.fire({
          title: 'รหัสผ่านไม่ตรงกัน',
          text: 'โปรดป้อนรหัสผ่านและยืนยันรหัสผ่านให้ตรงกัน',
          icon: 'warning',
          background: '#0f172a',
          color: '#f8fafc',
        })
        return
      }

      const token = localStorage.getItem('token')
      const headers = {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'multipart/form-data'
      }

      const formData = new FormData()
      formData.append('name', name)
      formData.append('username', username)
      formData.append('password', password)
      if (selectedFile) {
        formData.append('image', selectedFile)
      }

      const url = Config.apiUrl + '/members/update'
      const res = await axios.put(url, formData, { headers })

      if (res.data.image) {
        setImage(res.data.image)
      }

      // Dispatch event so Sidebar profile picture updates immediately
      window.dispatchEvent(new Event('profile-updated'))

      Swal.fire({
        title: 'อัปเดตข้อมูลสำเร็จ',
        text: 'บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        background: '#0f172a',
        color: '#f8fafc',
      })
      setPassword('')
      setConfirmPassword('')
      setSelectedFile(null)
      setPreviewUrl(null)
    } catch (err) {
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: (err as Error).message,
        icon: 'error',
        background: '#0f172a',
        color: '#f8fafc',
      })
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-2 sm:p-4 overflow-y-auto no-scrollbar">
      <div className="w-full max-w-2xl mx-auto space-y-4 text-slate-100 font-sans">
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between border-b border-slate-800/80 pb-2 mb-1">
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <i className="fa fa-user-gear text-indigo-400 text-sm" />
              แก้ไขข้อมูลส่วนตัว (Profile Management)
            </h1>
          </div>
        </div>

        {/* Profile Form Card */}
        <div className="w-full">
          <BorderGlow
            glowColor="240 80 70"
            backgroundColor="#0f172a"
            borderRadius={14}
            glowRadius={16}
            glowIntensity={1.05}
            colors={['#6366f1', '#a855f7', '#38bdf8']}
            className="w-full"
          >
            <div className="p-4 sm:p-5 flex flex-col gap-4">
              {/* User Avatar Badge Header */}
              <div className="flex items-center gap-4 pb-3 border-b border-slate-800/80">
                <div className="relative group">
                  <label className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-xl shadow-lg shadow-indigo-600/30 overflow-hidden border border-indigo-500/30 cursor-pointer block">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview Avatar" className="h-full w-full object-cover" />
                    ) : image ? (
                      <img src={`${Config.apiUrl}/uploads/${image}`} alt="Profile Avatar" className="h-full w-full object-cover" />
                    ) : (
                      name ? name.charAt(0).toUpperCase() : 'U'
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/75 opacity-0 group-hover:opacity-100 transition-all text-white text-base">
                      <i className="fa fa-camera" />
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-white">{name || 'กำลังโหลด...'}</h2>
                  <p className="text-xs text-slate-400">@{username || 'user'}</p>
                </div>
              </div>

              {/* Form Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    ชื่อ-นามสกุล <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs text-white placeholder:text-xs placeholder-slate-400 transition-all focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-inner"
                    placeholder="กรอกชื่อ-นามสกุล..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    ชื่อผู้ใช้งาน (Username) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs text-white placeholder:text-xs placeholder-slate-400 transition-all focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-inner"
                    placeholder="กรอก Username..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    รหัสผ่านใหม่ (New Password)
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs text-white placeholder:text-xs placeholder-slate-400 transition-all focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-inner"
                    placeholder="เว้นว่างไว้หากไม่ต้องการเปลี่ยน"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    ยืนยันรหัสผ่านใหม่ (Confirm Password)
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs text-white placeholder:text-xs placeholder-slate-400 transition-all focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-inner"
                    placeholder="ป้อนรหัสผ่านใหม่อีกครั้ง"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <span className="text-[11px] text-slate-400">
                  <i className="fa fa-circle-info text-indigo-400 mr-1" />
                  หากไม่ต้องการเปลี่ยนรหัสผ่าน ให้เว้นว่างช่องรหัสผ่านไว้
                </span>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-indigo-600/25 transition hover:bg-indigo-500 active:scale-95 cursor-pointer shrink-0"
                >
                  <i className="fa fa-floppy-disk text-xs" />
                  <span>บันทึกข้อมูล</span>
                </button>
              </div>
            </div>
          </BorderGlow>
        </div>
      </div>
    </div>
  )
}