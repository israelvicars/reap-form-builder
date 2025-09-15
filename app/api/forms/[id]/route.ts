import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CreateSectionInput } from '@/types/form'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const form = await prisma.form.findUnique({
    where: { id: params.id },
    include: { sections: { include: { fields: true } } },
  })

  if (!form) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(form)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { sections }: { sections: CreateSectionInput[] } = await req.json()

  try {
    // Delete existing sections and fields
    await prisma.field.deleteMany({
      where: { section: { formId: params.id } }
    })
    await prisma.section.deleteMany({
      where: { formId: params.id }
    })

    // Create new sections and fields
    const updatedForm = await prisma.form.update({
      where: { id: params.id },
      data: {
        sections: {
          create: sections.map(section => ({
            name: section.name,
            fields: {
              create: section.fields.map(field => ({
                label: field.label,
                type: field.type,
              }))
            }
          }))
        }
      },
      include: { sections: { include: { fields: true } } }
    })

    return NextResponse.json(updatedForm)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update form' }, { status: 500 })
  }
}