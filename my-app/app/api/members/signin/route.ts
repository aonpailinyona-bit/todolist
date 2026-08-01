import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()
    const trimmedUsername = (username || '').trim()
    const trimmedPassword = (password || '').trim()

    if (!trimmedUsername || !trimmedPassword) {
      return NextResponse.json({ message: 'username and password are required' }, { status: 400 })
    }

    const findUser = await prisma.member.findFirst({
      where: { username: trimmedUsername },
      select: { id: true, password: true }
    })

    if (!findUser) return NextResponse.json({ message: 'unauthorized' }, { status: 401 })

    const compare = await bcrypt.compare(trimmedPassword, findUser.password)
    if (!compare) return NextResponse.json({ message: 'unauthorized' }, { status: 401 })

    const secret_key = process.env.SECRET_KEY || "defaultSecretKey"
    const payload = { id: findUser.id }
    const options = { expiresIn: '1d' }

    const token = jwt.sign(payload, secret_key, options)

    return NextResponse.json({ token })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
