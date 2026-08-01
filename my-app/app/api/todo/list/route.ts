import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    const payload = verifyToken(req)
    if (!payload) return NextResponse.json({ message: 'unauthorized' }, { status: 401 })
    
    const member_id = payload.id
    
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    let condition: any = { member_id: member_id }

    if (status && status !== 'all') {
      if (status === 'wait' || status === 'use') {
        condition.OR = [{ status: 'wait' }, { status: 'use' }]
      } else {
        condition.status = status
      }
    }

    const todos = await prisma.todo.findMany({
      where: condition,
      orderBy: { id: 'desc' }
    })

    return NextResponse.json(todos)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
