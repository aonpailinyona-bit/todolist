'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Config } from '../signup/config'
import BorderGlow from '../../components/BorderGlow'

export default function Home() {
    const [userName, setUserName] = useState('')
    const [taskCount, setTaskCount] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchInfo()
    }, [])

    const fetchInfo = async () => {
        try {
            setIsLoading(true)
            const token = localStorage.getItem('token')
            if (!token) return

            const headers = { 'Authorization': 'Bearer ' + token }

            // Fetch user profile info
            const userRes = await axios.get(Config.apiUrl + '/members/info', { headers })
            if (userRes.status === 200) {
                setUserName(userRes.data.name || 'ผู้ใช้งาน')
            }

            // Fetch todo tasks count
            const todoRes = await axios.get(Config.apiUrl + '/todo/list', { headers })
            if (todoRes.status === 200) {
                const list = Array.isArray(todoRes.data) ? todoRes.data : (todoRes.data?.todos || [])
                setTaskCount(list.length)
            }
        } catch (err) {
            console.error('Error fetching home info:', err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full h-full flex flex-col justify-center items-center p-2 sm:p-4 overflow-y-auto no-scrollbar">
            <div className="w-full max-w-4xl mx-auto space-y-5 text-slate-100 font-sans">

                {/* Top Header Section */}
                <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-1">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-inner">
                                <i className="fa fa-house text-xl" />
                            </div>
                            <span>Welcome</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span className="inline-flex items-center gap-2 rounded-xl bg-slate-900/90 px-3.5 py-1.5 text-xs font-semibold text-slate-300 border border-slate-800 shadow-sm">
                            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>ระบบพร้อมใช้งาน</span>
                        </span>
                    </div>
                </div>

                {/* Welcome Banner Card */}
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
                        <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
                            <div className="space-y-1.5">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-300 border border-indigo-500/20">
                                    <span>✨</span>
                                    <span>พร้อมลุยงานวันนี้</span>
                                </span>
                                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                                    สวัสดี, <span className="text-indigo-400">{userName || 'ผู้ใช้งาน'}</span> 👋
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-normal">
                                    ระบบจัดการ Todo List พร้อมให้คุณบันทึกงาน ตรวจสอบสถานะงาน และติดตามผลการดำเนินงาน
                                </p>
                            </div>

                            <Link
                                href="/backoffice/home/todo"
                                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-md shadow-indigo-600/25 transition hover:bg-indigo-500 active:scale-95 shrink-0"
                            >
                                <i className="fa fa-plus text-xs" />
                                <span>เพิ่มรายการงานใหม่</span>
                            </Link>
                        </div>
                    </BorderGlow>
                </div>

                {/* Quick Action Navigation Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1 items-stretch">
                    {/* Card 1: Dashboard */}
                    <BorderGlow
                        glowColor="200 90 60"
                        backgroundColor="#0f172a"
                        borderRadius={14}
                        glowRadius={16}
                        glowIntensity={1.05}
                        colors={['#38bdf8', '#6366f1']}
                        className="w-full h-full"
                    >
                        <Link
                            href="/backoffice/home/dashboard"
                            className="group p-3.5 flex flex-col justify-between h-full space-y-2.5 transition hover:bg-slate-900/40"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 group-hover:scale-110 transition-transform">
                                    <i className="fa fa-chart-line text-sm" />
                                </div>
                                <i className="fa fa-arrow-right text-[11px] text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
                            </div>
                            <div>
                                <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-sky-400 transition leading-snug min-h-[2.25rem] flex items-center">
                                    ภาพรวมระบบ (Dashboard)
                                </h3>
                                <p className="mt-1 text-[11px] text-slate-400 leading-normal min-h-[2rem]">
                                    ตรวจสอบกราฟ สถิติสรุปงาน และอัตราความสำเร็จ
                                </p>
                            </div>
                        </Link>
                    </BorderGlow>

                    {/* Card 2: Todo Management */}
                    <BorderGlow
                        glowColor="160 80 50"
                        backgroundColor="#0f172a"
                        borderRadius={14}
                        glowRadius={16}
                        glowIntensity={1.05}
                        colors={['#10b981', '#34d399']}
                        className="w-full h-full"
                    >
                        <Link
                            href="/backoffice/home/todo"
                            className="group p-3.5 flex flex-col justify-between h-full space-y-2.5 transition hover:bg-slate-900/40"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                                    <i className="fa fa-list-check text-sm" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                                        {taskCount} งาน
                                    </span>
                                    <i className="fa fa-arrow-right text-[11px] text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-400 transition leading-snug min-h-[2.25rem] flex items-center">
                                    จัดการงาน (Todo List)
                                </h3>
                                <p className="mt-1 text-[11px] text-slate-400 leading-normal min-h-[2rem]">
                                    บันทึกงานใหม่ แก้ไข และอัปเดตสถานะงาน
                                </p>
                            </div>
                        </Link>
                    </BorderGlow>

                    {/* Card 3: Report Summary */}
                    <BorderGlow
                        glowColor="40 90 60"
                        backgroundColor="#0f172a"
                        borderRadius={14}
                        glowRadius={16}
                        glowIntensity={1.05}
                        colors={['#f59e0b', '#3b82f6']}
                        className="w-full h-full"
                    >
                        <Link
                            href="/backoffice/home/report"
                            className="group p-3.5 flex flex-col justify-between h-full space-y-2.5 transition hover:bg-slate-900/40"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
                                    <i className="fa fa-chart-pie text-sm" />
                                </div>
                                <i className="fa fa-arrow-right text-[11px] text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                            </div>
                            <div>
                                <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 transition leading-snug min-h-[2.25rem] flex items-center">
                                    รายงานสรุปผล (Report)
                                </h3>
                                <p className="mt-1 text-[11px] text-slate-400 leading-normal min-h-[2rem]">
                                    วิเคราะห์ประสิทธิภาพ และดูประวัติรายงาน
                                </p>
                            </div>
                        </Link>
                    </BorderGlow>

                    {/* Card 4: Profile Settings */}
                    <BorderGlow
                        glowColor="280 80 70"
                        backgroundColor="#0f172a"
                        borderRadius={14}
                        glowRadius={16}
                        glowIntensity={1.05}
                        colors={['#a855f7', '#ec4899']}
                        className="w-full h-full"
                    >
                        <Link
                            href="/backoffice/home/profile"
                            className="group p-3.5 flex flex-col justify-between h-full space-y-2.5 transition hover:bg-slate-900/40"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
                                    <i className="fa fa-user-gear text-sm" />
                                </div>
                                <i className="fa fa-arrow-right text-[11px] text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                            </div>
                            <div>
                                <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-purple-400 transition leading-snug min-h-[2.25rem] flex items-center">
                                    ข้อมูลส่วนตัว (Profile)
                                </h3>
                                <p className="mt-1 text-[11px] text-slate-400 leading-normal min-h-[2rem]">
                                    แก้ไขชื่อ รหัสผ่าน และเปลี่ยนรูปโปรไฟล์
                                </p>
                            </div>
                        </Link>
                    </BorderGlow>
                </div>

            </div>
        </div>
    )
}