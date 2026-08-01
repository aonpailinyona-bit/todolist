import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const payload = verifyToken(req)
    if (!payload) return NextResponse.json({ message: 'unauthorized' }, { status: 401 })
    
    const member_id = payload.id
    const { name, remark } = await req.json()

    await prisma.todo.create({
      data: {
        name: name,
        remark: remark,
        member_id: member_id
      }
    })

    return NextResponse.json({ message: 'success' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
