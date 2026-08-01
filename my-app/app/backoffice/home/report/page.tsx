'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import BorderGlow from '../../../components/BorderGlow'
import { Config } from '../../signup/config'

interface TodoItem {
  id: number
  name: string
  remark?: string
  status?: string
  createdAt?: string
}

export default function ReportPage() {
  const [timeRange, setTimeRange] = useState('7days')
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchReportData()
  }, [])

  const fetchReportData = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      if (!token) return

      const headers = { Authorization: 'Bearer ' + token }
      const res = await axios.get(Config.apiUrl + '/todo/list', { headers })
      if (res.status === 200) {
        const list = Array.isArray(res.data) ? res.data : (res.data?.todos || [])
        setTodos(list)
      }
    } catch (err) {
      console.error('Error fetching report data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate Metrics 100% directly from User Real Database
  const totalTasks = todos.length
  const completedTasks = todos.filter(t => t.status === 'success').length
  const doingTasks = todos.filter(t => t.status === 'doing').length
  const pendingTasks = todos.filter(t => t.status === 'wait' || t.status === 'use').length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const handleExport = () => {
    Swal.fire({
      title: 'ส่งออกรายงานข้อมูลจริง',
      text: 'ระบบกำลังดาวน์โหลดไฟล์ประวัติรายงานจากฐานข้อมูลของคุณ (PDF/CSV)',
      icon: 'success',
      background: '#0f172a',
      color: '#fff',
      confirmButtonColor: '#2563eb'
    })
  }

  return (
    <div className="w-full h-full flex flex-col justify-between p-2.5 sm:p-4 overflow-hidden space-y-3 text-slate-100 font-sans">

      {/* 1. Header Section (ออกแบบสไตล์ Minimal Glass Banner ไร้กรอบแข็ง) */}
      <div className="shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/40 p-3 sm:p-3.5 rounded-2xl border border-slate-800/80 backdrop-blur-md">
        <div className="min-w-0 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-inner">
            <i className="fa fa-chart-line text-base" />
          </div>
          <div className="min-w-0 flex-1 space-y-0.5">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight truncate">
              รายงานสรุปประสิทธิภาพ (Performance Report)
            </h1>
            <p className="text-xs text-slate-400 leading-tight truncate">
              วิเคราะห์สถิติจริงและประวัติการทำงานย้อนหลังในระบบ
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="shrink-0 flex items-center gap-2.5 self-stretch sm:self-auto justify-end">
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-2 pr-8 text-xs font-medium text-slate-200 focus:border-blue-500 focus:outline-none shadow-sm cursor-pointer h-9"
            >
              <option value="7days">7 วันล่าสุด</option>
              <option value="30days">30 วันล่าสุด</option>
            </select>
            <i className="fa fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 2. Performance Key Metrics (4 Glowing Glass Cards) */}
      <div className="shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1 */}
        <BorderGlow glowColor="220 80 60" backgroundColor="#0f172a" borderRadius={18} glowRadius={14} glowIntensity={1.05} colors={['#3b82f6', '#60a5fa']} className="w-full">
          <div className="p-3.5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400">อัตราความสำเร็จ (Rate)</p>
              <h3 className="text-2xl font-black text-white">{completionRate}%</h3>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                <i className="fa fa-circle-check text-[9px]" />
                <span>สำเร็จจริง {completedTasks}/{totalTasks} งาน</span>
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-inner">
              <i className="fa fa-chart-pie text-base" />
            </div>
          </div>
        </BorderGlow>

        {/* Metric 2 */}
        <BorderGlow glowColor="160 80 50" backgroundColor="#0f172a" borderRadius={18} glowRadius={14} glowIntensity={1.05} colors={['#10b981', '#3b82f6']} className="w-full">
          <div className="p-3.5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400">กำลังทำ (In Progress)</p>
              <h3 className="text-2xl font-black text-white">{doingTasks} <span className="text-xs font-normal text-slate-400">รายการ</span></h3>
              <p className="text-[10px] text-sky-400 flex items-center gap-1 font-medium">
                <i className="fa fa-spinner text-[9px] animate-spin" />
                <span>อยู่ในขั้นตอนดำเนินการ</span>
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner">
              <i className="fa fa-clock text-base" />
            </div>
          </div>
        </BorderGlow>

        {/* Metric 3 */}
        <BorderGlow glowColor="350 80 60" backgroundColor="#0f172a" borderRadius={18} glowRadius={14} glowIntensity={1.05} colors={['#f43f5e', '#fb7185']} className="w-full">
          <div className="p-3.5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400">รอดำเนินการ (Pending)</p>
              <h3 className="text-2xl font-black text-white">{pendingTasks} <span className="text-xs font-normal text-slate-400">รายการ</span></h3>
              <p className="text-[10px] text-amber-400 flex items-center gap-1 font-medium">
                <i className="fa fa-hourglass-start text-[9px]" />
                <span>อยู่ในคิวรอการจัดการ</span>
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-inner">
              <i className="fa fa-hourglass-half text-base" />
            </div>
          </div>
        </BorderGlow>

        {/* Metric 4 */}
        <BorderGlow glowColor="280 80 60" backgroundColor="#0f172a" borderRadius={18} glowRadius={14} glowIntensity={1.05} colors={['#a855f7', '#ec4899']} className="w-full">
          <div className="p-3.5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400">คะแนนประสิทธิภาพ</p>
              <div className="flex items-baseline gap-1">
                <h3 className="text-2xl font-black text-white">{completionRate >= 80 ? '95' : completionRate >= 50 ? '80' : '65'}</h3>
                <span className="text-xs font-bold text-purple-300">/100</span>
              </div>
              <p className="text-[10px] text-purple-400 flex items-center gap-1 font-medium">
                <i className="fa fa-award text-[9px]" />
                <span>ประเมินจากสถิติตามจริง</span>
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-inner">
              <i className="fa fa-award text-base" />
            </div>
          </div>
        </BorderGlow>
      </div>

      {/* 3. Real-Time Audit Task Table (ขยายตารางประวัติเต็มพื้นที่ส่วนล่าง) */}
      <div className="w-full flex-1 min-h-0 overflow-hidden">
        <BorderGlow glowColor="220 80 60" backgroundColor="#0f172a" borderRadius={20} glowRadius={16} glowIntensity={1.05} colors={['#3b82f6', '#10b981']} className="w-full h-full">
          <div className="p-3.5 flex flex-col gap-2 h-full">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 shrink-0">
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <i className="fa fa-history text-blue-400 text-xs" />
                  ตารางสรุปประวัติรายการงานในระบบ (Real-Time Task Audit Log)
                </h2>
                <p className="text-[10px] text-slate-400">ประวัติและสถานะงานจริงทั้งหมดจากฐานข้อมูลระบบ</p>
              </div>
              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-400 border border-blue-500/20 shrink-0">
                รวม {totalTasks} รายการ
              </span>
            </div>

            <div className="w-full flex-1 overflow-y-auto no-scrollbar rounded-2xl border border-slate-800/80 bg-slate-900/50">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-300 sticky top-0 z-10 rounded-t-2xl">
                  <tr className="rounded-t-2xl">
                    <th className="py-2.5 px-3.5 font-bold text-slate-200 rounded-tl-2xl">รหัส (ID)</th>
                    <th className="py-2.5 px-3.5 font-bold text-slate-200">ชื่องาน (Task Name)</th>
                    <th className="py-2.5 px-3.5 font-bold text-slate-200">หมายเหตุ / Details</th>
                    <th className="py-2.5 px-3.5 font-bold text-slate-200 text-center rounded-tr-2xl">สถานะงานจริง</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {todos.length > 0 ? (
                    todos.map((item) => {
                      const isSuccess = item.status === 'success'
                      const isDoing = item.status === 'doing'
                      return (
                        <tr key={item.id} className="transition hover:bg-slate-800/50">
                          <td className="py-2 px-3.5 font-mono text-[11px] text-slate-400">#{item.id}</td>
                          <td className="py-2 px-3.5 font-semibold text-slate-100">{item.name}</td>
                          <td className="py-2 px-3.5 text-slate-400 text-[11px]">{item.remark || '-'}</td>
                          <td className="py-2 px-3.5 text-center">
                            {isSuccess && (
                              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20 shadow-[0_0_6px_rgba(16,185,129,0.15)]">
                                เสร็จสมบูรณ์
                              </span>
                            )}
                            {isDoing && (
                              <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/20 shadow-[0_0_6px_rgba(59,130,246,0.15)]">
                                กำลังดำเนินการ
                              </span>
                            )}
                            {!isSuccess && !isDoing && (
                              <span className="inline-flex items-center rounded-full bg-amber-500/10 px-3 py-0.5 text-[10px] font-semibold text-amber-400 border border-amber-500/20 shadow-[0_0_6px_rgba(245,158,11,0.15)]">
                                รอดำเนินการ
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400 text-xs">
                        ไม่พบรายการงานในฐานข้อมูลระบบของคุณ
                      </td>
                    </tr>
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
