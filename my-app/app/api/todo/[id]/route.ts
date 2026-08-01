import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function PUT(req: Request, context: any) {
  try {
    const payload = verifyToken(req)
    if (!payload) return NextResponse.json({ message: 'unauthorized' }, { status: 401 })
    
    const params = await context.params
    const id = parseInt(params.id)
    const member_id = payload.id
    
    const body = await req.json()

    if (body.status !== undefined) {
      const dbStatus = body.status === 'wait' ? 'use' : body.status
      await prisma.todo.update({
        data: { status: dbStatus },
        where: { id: id, member_id: member_id }
      })
    } else {
      await prisma.todo.update({
        data: { name: body.name, remark: body.remark },
        where: { id: id, member_id: member_id }
      })
    }

    return NextResponse.json({ message: 'success' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: Request, context: any) {
  try {
    const payload = verifyToken(req)
    if (!payload) return NextResponse.json({ message: 'unauthorized' }, { status: 401 })
    
    const params = await context.params
    const id = parseInt(params.id)
    const member_id = payload.id

    await prisma.todo.delete({
      where: { id: id, member_id: member_id }
    })

    return NextResponse.json({ message: 'success' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
