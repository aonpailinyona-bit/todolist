import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { name, username, password } = await req.json()
    const trimmedName = (name || '').trim()
    const trimmedUsername = (username || '').trim()
    const trimmedPassword = (password || '').trim()

    if (!trimmedName || !trimmedUsername || !trimmedPassword) {
      return NextResponse.json({ message: 'name, username and password are required' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(trimmedPassword, 10)
    const newMember = await prisma.member.create({
      data: {
        name: trimmedName,
        username: trimmedUsername,
        password: hashedPassword
      }
    })
    return NextResponse.json(newMember)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
