import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { formId, data } = await req.json()

  const form = await prisma.form.findUnique({ where: { id: formId } })
  if (!form) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  await prisma.submission.create({
    data: { formId, data }
  })

  return NextResponse.json({ success: true })
}