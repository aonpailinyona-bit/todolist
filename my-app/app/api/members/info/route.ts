import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    const payload = verifyToken(req)
    if (!payload) return NextResponse.json({ message: 'unauthorized' }, { status: 401 })
    
    const member_id = payload.id

    const member = await prisma.member.findFirst({
      where: { id: member_id },
      select: { name: true, username: true, image: true }
    })

    return NextResponse.json(member)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
