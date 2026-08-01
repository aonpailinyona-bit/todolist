'use client'

import { Config } from '../../signup/config'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import BorderGlow from '../../../components/BorderGlow'

export default function Todo() {
    const [name, setName] = useState('')
    const [remark, setRemark] = useState('')
    const [id, setId] = useState(0)
    const [todos, setTodos] = useState<{ id: number; name: string; remark: string; status?: string }[]>([])
    const [statusList] = useState([
        { value: 'all', text: 'ทุกสถานะ' },
        { value: 'wait', text: 'รอทำ (Pending)' },
        { value: 'doing', text: 'กำลังทำ (In Progress)' },
        { value: 'success', text: 'ทำเสร็จแล้ว (Completed)' }
    ])
    const [status, setStatus] = useState('all')

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        if (status !== 'all') {
            filterData()
        } else {
            fetchData()
        }
    }, [status])

    const filterData = async () => {
        try {
            const url = Config.apiUrl + '/todo/list?status=' + status
            const token = localStorage.getItem('token')
            const headers = { 'Authorization': 'Bearer ' + token }

            const res = await axios.get(url, { headers })
            if (res.status === 200) {
                const data = Array.isArray(res.data) ? res.data : (res.data?.results || res.data?.todos || [])
                setTodos(data)
            }
        } catch (err) {
            console.error('Filter error:', err)
        }
    }

    const fetchData = async () => {
        try {
            const url = Config.apiUrl + '/todo/list'
            const token = localStorage.getItem('token')
            const headers = { 'Authorization': 'Bearer ' + token }

            const res = await axios.get(url, { headers })
            if (res.status === 200) {
                const data = Array.isArray(res.data) ? res.data : (res.data?.results || res.data?.todos || [])
                setTodos(data)
            }
        } catch (err) {
            console.error('Fetch error:', err)
        }
    }

    const handleSave = async () => {
        if (!name.trim()) {
            Swal.fire({
                title: 'กรุณากรอกชื่อสิ่งที่ต้องทำ',
                icon: 'warning',
                background: '#0f172a',
                color: '#f8fafc',
            })
            return
        }

        try {
            const token = localStorage.getItem('token')
            const headers = { 'Authorization': 'Bearer ' + token }
            const payload = { name: name, remark: remark }

            if (id === 0) {
                const url = Config.apiUrl + '/todo/create'
                await axios.post(url, payload, { headers })
            } else {
                const urlEdit = Config.apiUrl + '/todo/' + id
                await axios.put(urlEdit, payload, { headers })
            }

            Swal.fire({
                title: 'บันทึกรายการสำเร็จ',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
                background: '#0f172a',
                color: '#f8fafc',
            })
            fetchData()
            setName('')
            setRemark('')
            setId(0)
        } catch (err) {
            Swal.fire({
                title: 'ไม่สามารถบันทึกได้',
                text: 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์ (Network Error)',
                icon: 'error',
                background: '#0f172a',
                color: '#f8fafc',
            })
        }
    }

    const handleEdit = (todo: { id: number; name: string; remark: string }) => {
        setId(todo.id)
        setName(todo.name)
        setRemark(todo.remark)
    }

    const handleRemove = async (id: number) => {
        const confirmButton = await Swal.fire({
            title: 'ลบรายการ',
            text: 'คุณต้องการลบรายการใช่หรือไม่ ?',
            icon: 'question',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'ลบข้อมูล',
            cancelButtonText: 'ยกเลิก',
            background: '#0f172a',
            color: '#f8fafc',
        })

        if (confirmButton.isConfirmed) {
            try {
                const url = Config.apiUrl + '/todo/' + id
                const token = localStorage.getItem('token')
                const headers = { 'Authorization': 'Bearer ' + token }
                await axios.delete(url, { headers })
                fetchData()
            } catch (err) {
                Swal.fire({
                    title: 'ไม่สามารถลบได้',
                    text: (err as Error).message,
                    icon: 'error',
                    background: '#0f172a',
                    color: '#f8fafc',
                })
            }
        }
    }

    const updateStatus = async (id: number, status: string) => {
        try {
            const url = Config.apiUrl + '/todo/' + id
            const token = localStorage.getItem('token')
            const headers = { 'Authorization': 'Bearer ' + token }
            const payload = { status: status }

            await axios.put(url, payload, { headers })
            fetchData()
        } catch (err) {
            console.error('Update status error:', err)
        }
    }

    return (
        <div className="w-full h-full flex flex-col justify-center items-center py-4 overflow-y-auto no-scrollbar">
            <div className="w-full max-w-5xl mx-auto flex flex-col gap-4 text-slate-100 font-sans px-2">
                {/* 1. Header หลัก (Compact View) */}
                <div className="shrink-0 flex items-center justify-between border-b border-slate-800/80 pb-2 mb-1">
                    <div>
                        <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                            จัดการรายการงาน (Todo Management)
                        </h1>
                    </div>
                </div>

                {/* 3. Card บันทึกรายการใหม่ (Form Card Compact) */}
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
                        <div className="p-3.5 sm:p-4 flex flex-col gap-3">
                            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                                <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                                    <i className="fa fa-pen-to-square text-indigo-400 text-sm" />
                                    {id === 0 ? 'บันทึกรายการใหม่' : `แก้ไขรายการงาน #${id}`}
                                </h2>
                                {id !== 0 && (
                                    <button
                                        type="button"
                                        onClick={() => { setId(0); setName(''); setRemark('') }}
                                        className="text-xs text-rose-400 hover:text-rose-300 underline font-medium"
                                    >
                                        ยกเลิกการแก้ไข
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-slate-200 mb-1.5">
                                        ชื่อสิ่งที่ต้องทำ <span className="text-rose-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs sm:text-sm text-white placeholder:text-xs placeholder-slate-500 transition-all focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-inner"
                                        placeholder="กรอกชื่องานหรือสิ่งที่ต้องทำ..."
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-slate-200 mb-1.5">
                                        หมายเหตุ / รายละเอียดเพิ่มเติม
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs sm:text-sm text-white placeholder:text-xs placeholder-slate-400 transition-all focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-inner"
                                        placeholder="กรอกรายละเอียดหรือหมายเหตุเพิ่มเติม..."
                                        value={remark}
                                        onChange={(e) => setRemark(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-1">
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-indigo-600/25 transition hover:bg-indigo-500 active:scale-95 cursor-pointer"
                                >
                                    <i className="fa fa-floppy-disk text-xs sm:text-sm" />
                                    <span>{id === 0 ? 'บันทึกรายการ' : 'อัปเดตข้อมูล'}</span>
                                </button>
                            </div>
                        </div>
                    </BorderGlow>
                </div>

                {/* 4. Card รายการงานทั้งหมด (Table Card Dynamic Height) */}
                <div className="w-full">
                    <BorderGlow
                        glowColor="220 80 65"
                        backgroundColor="#0f172a"
                        borderRadius={14}
                        glowRadius={16}
                        glowIntensity={1.05}
                        colors={['#6366f1', '#38bdf8', '#a855f7']}
                        className="w-full"
                    >
                        <div className="p-3.5 sm:p-4 flex flex-col gap-3">
                            {/* Header & Status Filter */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                                <div>
                                    <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                                        <i className="fa fa-list-check text-indigo-400 text-sm" />
                                        รายการงานทั้งหมดในระบบ
                                    </h2>
                                    <p className="text-xs text-slate-400">แสดงผลงานตามสถานะที่เลือก</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-slate-300 shrink-0">เลือกสถานะงาน:</span>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 shadow-sm cursor-pointer"
                                    >
                                        {statusList.map((item) => (
                                            <option key={item.value} value={item.value} className="bg-slate-900 text-slate-200">
                                                {item.text}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Dynamic Height Table Container */}
                            <div className="w-full overflow-hidden no-scrollbar rounded-lg border border-slate-800/80 bg-slate-900/50">
                                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                                    <thead className="bg-slate-900 border-b border-slate-800 text-slate-300">
                                        <tr>
                                            <th className="py-2.5 px-3.5 text-xs sm:text-sm font-bold text-slate-200">ชื่องาน (Task Name)</th>
                                            <th className="py-2.5 px-3.5 text-xs sm:text-sm font-bold text-slate-200">หมายเหตุ / Details</th>
                                            <th className="py-2.5 px-3.5 text-xs sm:text-sm font-bold text-slate-200 text-center">สถานะ</th>
                                            <th className="py-2.5 px-3.5 text-xs sm:text-sm font-bold text-slate-200 text-center">จัดการ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/60">
                                        {todos.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="py-8 text-center text-slate-400 text-xs sm:text-sm">
                                                    ไม่พบรายการงานในฐานข้อมูล
                                                </td>
                                            </tr>
                                        ) : (
                                            todos.map((item) => {
                                                const currentSt = item.status === 'use' || !item.status ? 'wait' : item.status
                                                return (
                                                    <tr key={item.id} className="transition-all hover:bg-slate-800/50">
                                                        <td className="py-2.5 px-3.5 text-xs sm:text-sm font-semibold text-slate-100">{item.name}</td>
                                                        <td className="py-2.5 px-3.5 text-xs text-slate-400">{item.remark || '-'}</td>
                                                        <td className="py-2.5 px-3.5 text-center">
                                                            {currentSt === 'wait' && (
                                                                <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold text-amber-400 border border-amber-500/20 shadow-[0_0_6px_rgba(245,158,11,0.15)]">
                                                                    รอทำ
                                                                </span>
                                                            )}
                                                            {currentSt === 'doing' && (
                                                                <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold text-blue-400 border border-blue-500/20 shadow-[0_0_6px_rgba(59,130,246,0.15)]">
                                                                    กำลังทำ
                                                                </span>
                                                            )}
                                                            {currentSt === 'success' && (
                                                                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold text-emerald-400 border border-emerald-500/20 shadow-[0_0_6px_rgba(16,185,129,0.15)]">
                                                                    เสร็จเรียบร้อย
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="py-2.5 px-3.5 text-center">
                                                            <div className="inline-flex items-center justify-center gap-1.5 flex-wrap">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => updateStatus(item.id, 'use')}
                                                                    className={`rounded-md px-2 py-1 text-[11px] sm:text-xs font-medium transition ${currentSt === 'wait' ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}
                                                                >
                                                                    รอทำ
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => updateStatus(item.id, 'doing')}
                                                                    className={`rounded-md px-2 py-1 text-[11px] sm:text-xs font-medium transition ${currentSt === 'doing' ? 'bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}
                                                                >
                                                                    กำลังทำ
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => updateStatus(item.id, 'success')}
                                                                    className={`rounded-md px-2 py-1 text-[11px] sm:text-xs font-medium transition ${currentSt === 'success' ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}
                                                                >
                                                                    ทำแล้ว
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleEdit(item)}
                                                                    className="rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-1 text-[11px] sm:text-xs font-medium transition hover:bg-sky-500 hover:text-white"
                                                                    title="แก้ไข"
                                                                >
                                                                    <i className="fa fa-pencil" />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemove(item.id)}
                                                                    className="rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-1 text-xs font-medium transition hover:bg-rose-500 hover:text-white"
                                                                    title="ลบ"
                                                                >
                                                                    <i className="fa fa-times" />
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
        </div>
    )
}