'use client'

import axios from 'axios'

export default function Http() {
  const url = 'http://localhost:3000'
  const payload = {
    id: 100,
    name: 'java',
    price: 900
  }

  // ดึงข้อมูลมาแสดงผล
  const doGet = async () => {
    const response = await axios.get(url)
    console.log(response.data)
  }

  // เพิ่มข้อมูล
  const doPost = async () => {
    const response = await axios.post(url, payload)
    console.log(response.data)
  }

  const doPut = async () => {
    const response = await axios.put(url + '/1', payload)
    console.log(response.data)
  }

  // ลบข้อมูล
  const doDelete = async () => {
    const response = await axios.delete(url + '/1')
    console.log(response.data)
  }

  return (
    <div className="flex gap-2">
      <button className='button' onClick={doGet}>GET</button>
      <button className='button' onClick={doPost}>POST</button>
      <button className='button' onClick={doPut}>PUT</button>
      <button className='button' onClick={doDelete}>DELETE</button>
    </div>
  )
}