'use client'

import { ChangeEvent, FormEvent, useState } from "react"
import axios from 'axios'

export default function Upload() {
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState<string>('')

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile: File | null = e.target.files?.length ? e.target.files[0] : null
    setFile(selectedFile)
  }

  const upload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!file) return alert('plase select a file')

    const allowedTypes = ['image/png', 'image/jpeg']

    if (!allowedTypes.includes(file.type)) {
      return alert('png or jpeg only')
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      const url = 'http://localhost:3001/upload'
      const res = await axios.post<{ message: string }>(url, formData)

      if (res.status === 200) {
        setMessage(res.data.message)
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(err.message)
      } else {
        setMessage('upload fail')
      }
    }

  }

  return (
    <form className="flex flex-col gap-4 p-10" onSubmit={upload}>
      <div>File <input type="file"
        onChange={handleFileChange}
        accept="image/png, image/jpeg"
        className="border ⬜ border-gray-800 p-3 rounded-md" /></div>
      <div><button className="button" type="submit">Send File to Server</button></div>
      {message && <p>{message}</p>}
    </form>
  )
}