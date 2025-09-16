'use server'

import { prisma } from '@/lib/prisma'
import { checkAdmin } from '@/lib/auth'
import { CreateSectionInput } from '@/types/form'

export async function createForm(sections: CreateSectionInput[]) {
  await checkAdmin()

  if (sections.length > 2 || sections.some(s => s.fields.length > 3)) {
    throw new Error('Limits exceeded: max 2 sections, 3 fields each')
  }

  if (sections.some(s => !s.name.trim() || s.fields.some(f => !f.label.trim()))) {
    throw new Error('Please fill in all section names and field labels')
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

  return { success: true, formId: form.id }
}

export async function deleteForm(id: string) {
  await checkAdmin()

  await prisma.form.delete({ where: { id } })
}