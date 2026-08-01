import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

export async function PUT(req: Request) {
  try {
    const payload = verifyToken(req)
    if (!payload) return NextResponse.json({ message: 'unauthorized' }, { status: 401 })
    
    const member_id = payload.id
    
    const formData = await req.formData()
    const name = formData.get('name') as string
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    const image = formData.get('image') as File | null

    const oldMember = await prisma.member.findFirst({
      where: { id: member_id }
    })
    
    if (!oldMember) return NextResponse.json({ message: 'User not found' }, { status: 404 })

    let imageName = oldMember.image
    
    if (image && image.size > 0) {
      const ext = image.name.split('.').pop()
      imageName = 'avatar_' + member_id + '_' + Date.now() + '.' + ext
      
      const arrayBuffer = await image.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(imageName, buffer, {
          contentType: image.type,
          upsert: true
        })
        
      if (error) {
        console.error("Supabase storage error:", error)
        throw new Error("Failed to upload image. Did you create the 'avatars' bucket?")
      }
      
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(imageName)
      imageName = publicUrl
    }

    let hashedPassword = oldMember.password
    if (password && password.trim() !== '') {
      hashedPassword = await bcrypt.hash(password, 10)
    }

    await prisma.member.update({
      data: {
        name: name,
        username: username,
        password: hashedPassword,
        image: imageName
      },
      where: { id: member_id }
    })

    return NextResponse.json({ message: 'success', image: imageName })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
