import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CreateFormInput } from '@/types/form'

export async function GET(req: NextRequest) {
  if (req.cookies.get('isAdmin')?.value !== 'true') {
    return NextResponse.json({}, { status: 401 })
  }

  const forms = await prisma.form.findMany({
    select: { id: true, createdAt: true }
  })
  return NextResponse.json(forms)
}

export async function POST(req: NextRequest) {
  if (req.cookies.get('isAdmin')?.value !== 'true') {
    return NextResponse.json({}, { status: 401 })
  }

  const { sections }: CreateFormInput = await req.json()

  if (sections.length > 2 || sections.some(s => s.fields.length > 3)) {
    return NextResponse.json({ error: 'Limits exceeded' }, { status: 400 })
  }

  const form = await prisma.form.create({ data: {} })

  for (const sec of sections) {
    const createdSec = await prisma.section.create({
      data: { name: sec.name, formId: form.id }
    })
    for (const field of sec.fields) {
      await prisma.field.create({
        data: {
          label: field.label,
          type: field.type,
          sectionId: createdSec.id
        }
      })
    }
  }

  return NextResponse.json({ id: form.id })
}