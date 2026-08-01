'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Config } from '../../signup/config'
import Swal from 'sweetalert2'
import BorderGlow from '../../../components/BorderGlow'

interface TodoItem {
  id: number
  name: string
  remark?: string
  status?: string
  createdAt?: string
}

export default function Dashboard() {
  // Backend Live States
  const [countWait, setCountWait] = useState(0)
  const [countDoing, setCountDoing] = useState(0)
  const [countSuccess, setCountSuccess] = useState(0)
  const [todoList, setTodoList] = useState<TodoItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Interactive UI Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [tableFilter, setTableFilter] = useState('all')

  useEffect(() => {
    fetchBackendData()
  }, [])

  const fetchBackendData = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      if (!token) return

      const headers = { 'Authorization': 'Bearer ' + token }

      // 1. Fetch Dashboard Counters (/todo/dashboard)
      const dashboardUrl = Config.apiUrl + '/todo/dashboard'
      const dashRes = await axios.get(dashboardUrl, { headers })

      if (dashRes.status === 200) {
        setCountWait(dashRes.data.countWait || 0)
        setCountDoing(dashRes.data.countDoing || 0)
        setCountSuccess(dashRes.data.countSuccess || 0)
      }

      // 2. Fetch Todo List (/todo/list)
      const listUrl = Config.apiUrl + '/todo/list'
      const listRes = await axios.get(listUrl, { headers })

      if (listRes.status === 200 && Array.isArray(listRes.data)) {
        setTodoList(listRes.data)
      }
    } catch (err) {
      console.error('Fetch error:', err)
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถดึงข้อมูลใหม่จากเซิร์ฟเวอร์ได้',
        background: '#0f172a',
        color: '#fff',
        confirmButtonColor: '#2563eb'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Quick Status Change from Dashboard
  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('token')
      const headers = { 'Authorization': 'Bearer ' + token }
      const url = `${Config.apiUrl}/todo/updateStatus/${id}`

      const res = await axios.post(url, { status: newStatus }, { headers })
      if (res.status === 200) {
        Swal.fire({
          title: 'อัปเดตสถานะสำเร็จ',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          background: '#0f172a',
          color: '#f8fafc',
        })
        fetchBackendData()
      }
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

  const totalTasks = countWait + countDoing + countSuccess
  const completionRate = totalTasks > 0 ? ((countSuccess / totalTasks) * 100).toFixed(1) : '0'

  // Filtered Table Items
  const filteredTodos = todoList.filter(t => {
    const statusVal = t.status === 'use' || !t.status ? 'wait' : t.status
    const matchStatus = tableFilter === 'all' || statusVal === tableFilter
    const matchSearch = searchQuery === '' || t.name.toLowerCase().includes(searchQuery.toLowerCase()) || (t.remark && t.remark.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchStatus && matchSearch
  })

  // Donut Percentages
  const waitPct = totalTasks > 0 ? Math.round((countWait / totalTasks) * 100) : 0
  const doingPct = totalTasks > 0 ? Math.round((countDoing / totalTasks) * 100) : 0
  const successPct = totalTasks > 0 ? Math.round((countSuccess / totalTasks) * 100) : 0

  return (
    <div className="h-full w-full max-w-7xl mx-auto flex flex-col gap-3 text-slate-100 font-sans overflow-hidden">
      {/* ================= Header Bar ================= */}
      <div className="shrink-0 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between border-b border-slate-800/80 pb-2.5">
        <div className="flex justify-center w-full">
          <div className="flex items-center justify-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl text-center">
              Dashboard
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Global Search Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              // Focus table or scroll to filtered results smoothly
              const tableEl = document.querySelector('table')
              if (tableEl) tableEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
            }}
            className="relative w-56 sm:w-64 lg:w-72 flex items-center"
          >
            <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหางาน"
              className="w-full rounded-lg border border-slate-800 bg-slate-900/90 py-1.5 pl-8 pr-14 text-xs sm:text-sm text-slate-200 placeholder-slate-500 transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md bg-indigo-600/80 hover:bg-indigo-500 px-2 py-0.5 text-[11px] font-semibold text-white transition active:scale-95 border border-indigo-500/30 shadow-sm"
            >
              ค้นหา
            </button>
          </form>

        </div>
      </div>

      {/* ================= Top Row - 4 Real KPI Summary Cards ================= */}
      <div className="shrink-0 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Total Tasks */}
        <BorderGlow
          glowColor="240 80 70"
          backgroundColor="#0f172a"
          borderRadius={14}
          glowRadius={16}
          glowIntensity={1.05}
          colors={['#6366f1', '#38bdf8', '#818cf8']}
          className="w-full"
        >
          <div className="group relative overflow-hidden p-3 sm:p-3.5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-semibold text-slate-300 truncate">งานทั้งหมด</span>
              <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-2 py-0.5 text-[11px] font-semibold text-indigo-400 border border-indigo-500/20">
                <i className="fa fa-tasks text-[10px]" /> รวม
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                {totalTasks} <span className="text-xs font-normal text-slate-400">งาน</span>
              </div>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 truncate">รวมทุกสถานะในระบบ</p>
          </div>
        </BorderGlow>

        {/* Metric 2: Pending Tasks */}
        <BorderGlow
          glowColor="40 90 60"
          backgroundColor="#0f172a"
          borderRadius={14}
          glowRadius={16}
          glowIntensity={1.05}
          colors={['#f59e0b', '#fbbf24', '#d97706']}
          className="w-full"
        >
          <div className="group relative overflow-hidden p-3 sm:p-3.5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-semibold text-slate-300 truncate">งานที่รอทำ</span>
              <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-400 border border-amber-500/20">
                <i className="fa fa-clock text-[10px]" /> รอทำ
              </span>
            </div>
            <div className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-amber-400">
              {countWait} <span className="text-xs font-normal text-slate-400">งาน</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 truncate">คิดเป็น {waitPct}% ของทั้งหมด</p>
          </div>
        </BorderGlow>

        {/* Metric 3: In Progress Tasks */}
        <BorderGlow
          glowColor="200 90 60"
          backgroundColor="#0f172a"
          borderRadius={14}
          glowRadius={16}
          glowIntensity={1.05}
          colors={['#3b82f6', '#60a5fa', '#1d4ed8']}
          className="w-full"
        >
          <div className="group relative overflow-hidden p-3 sm:p-3.5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-semibold text-slate-300 truncate">กำลังดำเนินการ</span>
              <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-semibold text-blue-400 border border-blue-500/20">
                <i className="fa fa-spinner text-[10px]" /> ทำอยู่
              </span>
            </div>
            <div className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-blue-400">
              {countDoing} <span className="text-xs font-normal text-slate-400">งาน</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 truncate">คิดเป็น {doingPct}% ของทั้งหมด</p>
          </div>
        </BorderGlow>

        {/* Metric 4: Completed Rate */}
        <BorderGlow
          glowColor="160 80 50"
          backgroundColor="#0f172a"
          borderRadius={14}
          glowRadius={16}
          glowIntensity={1.05}
          colors={['#10b981', '#34d399', '#059669']}
          className="w-full"
        >
          <div className="group relative overflow-hidden p-3 sm:p-3.5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-semibold text-slate-300 truncate">อัตราทำสำเร็จ</span>
              <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                <i className="fa fa-check-circle text-[10px]" /> {countSuccess} งาน
              </span>
            </div>
            <div className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-emerald-400">
              {completionRate}%
            </div>
            <div className="mt-1.5 w-full rounded-full bg-slate-800/80 h-1.5 overflow-hidden shadow-inner">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: `${completionRate}%` }} />
            </div>
          </div>
        </BorderGlow>
      </div>

      {/* ================= Middle Row - Visualizations (8 / 4 Split) ================= */}
      <div className="shrink-0 grid grid-cols-1 gap-3 lg:grid-cols-12">
        {/* Progress Breakdown Cards (8 cols) */}
        <div className="lg:col-span-8">
          <BorderGlow
            glowColor="220 80 65"
            backgroundColor="#0f172a"
            borderRadius={14}
            glowRadius={20}
            glowIntensity={1.05}
            colors={['#6366f1', '#3b82f6', '#10b981']}
            className="w-full h-full"
          >
            <div className="flex flex-col justify-between p-2.5 sm:p-3 h-full space-y-1.5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs sm:text-sm font-bold text-white">สัดส่วนสถานะงาน (Status Breakdown)</h2>
                </div>
              </div>

              <div className="space-y-1.5">
                {/* Status Sub-card 1: งานที่รอทำ (Waiting) */}
                <div className="rounded-lg border border-slate-800/80 bg-slate-800/40 px-3 py-1.5 transition hover:bg-slate-800/60">
                  <div className="flex items-center justify-between text-xs font-semibold mb-0.5">
                    <span className="text-amber-400 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#F59E0B] shadow-[0_0_4px_#F59E0B]" />
                      งานที่รอทำ (Waiting)
                    </span>
                    <span className="text-slate-200 font-mono text-xs">{countWait} งาน ({waitPct}%)</span>
                  </div>
                  <div className="w-full bg-slate-900/90 h-1.5 rounded-full overflow-hidden p-0.5 shadow-inner">
                    <div className="bg-[#F59E0B] h-full rounded-full transition-all duration-500 shadow-[0_0_6px_rgba(245,158,11,0.5)]" style={{ width: `${waitPct}%` }} />
                  </div>
                </div>

                {/* Status Sub-card 2: งานกำลังทำ (In Progress) */}
                <div className="rounded-lg border border-slate-800/80 bg-slate-800/40 px-3 py-1.5 transition hover:bg-slate-800/60">
                  <div className="flex items-center justify-between text-xs font-semibold mb-0.5">
                    <span className="text-blue-400 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#3B82F6] shadow-[0_0_4px_#3B82F6]" />
                      งานกำลังทำ (In Progress)
                    </span>
                    <span className="text-slate-200 font-mono text-xs">{countDoing} งาน ({doingPct}%)</span>
                  </div>
                  <div className="w-full bg-slate-900/90 h-1.5 rounded-full overflow-hidden p-0.5 shadow-inner">
                    <div className="bg-[#3B82F6] h-full rounded-full transition-all duration-500 shadow-[0_0_6px_rgba(59,130,246,0.5)]" style={{ width: `${doingPct}%` }} />
                  </div>
                </div>

                {/* Status Sub-card 3: งานที่เสร็จแล้ว (Completed) */}
                <div className="rounded-lg border border-slate-800/80 bg-slate-800/40 px-3 py-1.5 transition hover:bg-slate-800/60">
                  <div className="flex items-center justify-between text-xs font-semibold mb-0.5">
                    <span className="text-emerald-400 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#10B981] shadow-[0_0_4px_#10B981]" />
                      งานที่เสร็จแล้ว (Completed)
                    </span>
                    <span className="text-slate-200 font-mono text-xs">{countSuccess} งาน ({successPct}%)</span>
                  </div>
                  <div className="w-full bg-slate-900/90 h-1.5 rounded-full overflow-hidden p-0.5 shadow-inner">
                    <div className="bg-[#10B981] h-full rounded-full transition-all duration-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" style={{ width: `${successPct}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </BorderGlow>
        </div>

        {/* Distribution Donut Chart (4 cols) */}
        <div className="lg:col-span-4">
          <BorderGlow
            glowColor="190 80 60"
            backgroundColor="#0f172a"
            borderRadius={14}
            glowRadius={20}
            glowIntensity={1.05}
            colors={['#3b82f6', '#10b981', '#f59e0b']}
            className="w-full h-full"
          >
            <div className="flex flex-col justify-between items-center p-2.5 sm:p-3 h-full text-center">
              <div className="w-full text-left">
                <h2 className="text-xs sm:text-sm font-bold text-white">สถานะงาน (Task Ratio)</h2>
              </div>

              {/* Centered Donut & Compact Legend */}
              <div className="w-full my-auto flex flex-col items-center justify-center gap-1 py-0.5">
                <div className="relative h-18 w-18 sm:h-20 sm:w-20 flex items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="#1e293b" strokeWidth="12" fill="none" />
                    {/* Success Arc */}
                    <circle cx="50" cy="50" r="38" stroke="#10B981" strokeWidth="12" fill="none" strokeDasharray={`${successPct * 2.38} 238`} strokeDashoffset="0" />
                    {/* Doing Arc */}
                    <circle cx="50" cy="50" r="38" stroke="#3B82F6" strokeWidth="12" fill="none" strokeDasharray={`${doingPct * 2.38} 238`} strokeDashoffset={`-${successPct * 2.38}`} />
                    {/* Wait Arc */}
                    <circle cx="50" cy="50" r="38" stroke="#F59E0B" strokeWidth="12" fill="none" strokeDasharray={`${waitPct * 2.38} 238`} strokeDashoffset={`-${(successPct + doingPct) * 2.38}`} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-base font-extrabold text-white">{totalTasks}</span>
                    <span className="text-[9px] font-medium text-slate-400">รายการ</span>
                  </div>
                </div>

                <div className="w-full space-y-0.5 text-[10px]">
                  <div className="flex items-center justify-between rounded-md bg-slate-800/40 border border-slate-800/80 px-2 py-0.5">
                    <span className="flex items-center gap-1 text-slate-300 font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" /> งานรอทำ
                    </span>
                    <span className="font-semibold text-white font-mono text-[10px]">{countWait} ({waitPct}%)</span>
                  </div>
                  <div className="flex items-center justify-between rounded-md bg-slate-800/40 border border-slate-800/80 px-2 py-0.5">
                    <span className="flex items-center gap-1 text-slate-300 font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#3B82F6]" /> กำลังทำ
                    </span>
                    <span className="font-semibold text-white font-mono text-[10px]">{countDoing} ({doingPct}%)</span>
                  </div>
                  <div className="flex items-center justify-between rounded-md bg-slate-800/40 border border-slate-800/80 px-2 py-0.5">
                    <span className="flex items-center gap-1 text-slate-300 font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" /> เสร็จแล้ว
                    </span>
                    <span className="font-semibold text-white font-mono text-[10px]">{countSuccess} ({successPct}%)</span>
                  </div>
                </div>
              </div>
            </div>
          </BorderGlow>
        </div>
      </div>

      {/* ================= Bottom Row - Real Todo Tasks Table (Strict Viewport Fit & Inner Scroll) ================= */}
      <div className="flex-1 min-h-0 w-full overflow-hidden">
        <BorderGlow
          glowColor="220 80 65"
          backgroundColor="#0f172a"
          borderRadius={14}
          glowRadius={20}
          glowIntensity={1.05}
          colors={['#6366f1', '#38bdf8', '#a855f7']}
          className="w-full h-full"
        >
          <div className="p-3.5 sm:p-4 h-full flex flex-col justify-between overflow-hidden gap-2">
            <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-white">รายการงานทั้งหมดในหลังบ้าน (Recent Todo Tasks)</h2>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={tableFilter}
                  onChange={(e) => setTableFilter(e.target.value)}
                  className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 shadow-sm"
                >
                  <option value="all">สถานะทั้งหมด</option>
                  <option value="wait">รอทำ (use)</option>
                  <option value="doing">กำลังทำ (doing)</option>
                  <option value="success">เสร็จแล้ว (success)</option>
                </select>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto rounded-lg border border-slate-800/80 bg-slate-900/50 pr-1">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 text-slate-300 z-10">
                  <tr>
                    <th className="py-2 px-3 font-bold">รหัส (ID)</th>
                    <th className="py-2 px-3 font-bold">ชื่องาน (Task Name)</th>
                    <th className="py-2 px-3 font-bold">หมายเหตุ / Details</th>
                    <th className="py-2 px-3 font-bold">สถานะปัจจุบัน</th>
                    <th className="py-2 px-3 font-bold text-right">จัดการสถานะด่วน</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredTodos.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-slate-400 text-xs">
                        {isLoading ? 'กำลังโหลดข้อมูลจากหลังบ้าน...' : 'ไม่พบรายการงานในฐานข้อมูล'}
                      </td>
                    </tr>
                  ) : (
                    filteredTodos.map((item) => {
                      const currentSt = item.status === 'use' || !item.status ? 'wait' : item.status
                      return (
                        <tr key={item.id} className="transition-all hover:bg-slate-800/50">
                          <td className="py-2 px-3 font-mono font-medium text-slate-400">#{item.id}</td>
                          <td className="py-2 px-3 font-semibold text-slate-100">{item.name}</td>
                          <td className="py-2 px-3 text-slate-400">{item.remark || '-'}</td>
                          <td className="py-2 px-3">
                            {currentSt === 'wait' && (
                              <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-400 border border-amber-500/20 shadow-[0_0_6px_rgba(245,158,11,0.15)]">
                                รอทำ
                              </span>
                            )}
                            {currentSt === 'doing' && (
                              <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-semibold text-blue-400 border border-blue-500/20 shadow-[0_0_6px_rgba(59,130,246,0.15)]">
                                กำลังทำ
                              </span>
                            )}
                            {currentSt === 'success' && (
                              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20 shadow-[0_0_6px_rgba(16,185,129,0.15)]">
                                เสร็จเรียบร้อย
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-3 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(item.id, 'use')}
                                className={`rounded-md px-2 py-0.5 text-[11px] font-medium transition ${currentSt === 'wait' ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}
                              >
                                รอทำ
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(item.id, 'doing')}
                                className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${currentSt === 'doing' ? 'bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}
                              >
                                กำลังทำ
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(item.id, 'success')}
                                className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${currentSt === 'success' ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}
                              >
                                เสร็จแล้ว
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </BorderGlow>
      </div>
    </div>
  )
}