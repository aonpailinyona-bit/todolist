import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    const payload = verifyToken(req)
    if (!payload) return NextResponse.json({ message: 'unauthorized' }, { status: 401 })
    
    const member_id = payload.id

    const countWait = await prisma.todo.aggregate({
      _count: { id: true },
      where: { status: { in: ['use', 'wait'] }, member_id: member_id }
    })

    const countDoing = await prisma.todo.aggregate({
      _count: { id: true },
      where: { status: 'doing', member_id: member_id }
    })

    const countSuccess = await prisma.todo.aggregate({
      _count: { id: true },
      where: { status: 'success', member_id: member_id }
    })

    return NextResponse.json({
      countWait: countWait._count.id,
      countDoing: countDoing._count.id,
      countSuccess: countSuccess._count.id
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
