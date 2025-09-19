'use server'

import { prisma } from '@/lib/prisma'
import { checkAdmin } from '@/lib/auth'
import { CreateSectionInput, FormWithSubmissions } from '@/types/form'
import { revalidatePath } from 'next/cache'

export async function createForm(title: string, description: string, sections: CreateSectionInput[]) {
  await checkAdmin()

  if (sections.length > 2 || sections.some(s => s.fields.length > 3)) {
    throw new Error('Limits exceeded: max 2 sections, 3 fields each')
  }

  if (sections.some(s => !s.name.trim() || s.fields.some(f => !f.label.trim()))) {
    throw new Error('Please fill in all section names and field labels')
  }

  const form = await prisma.form.create({
    data: {
      title: title || '',
      description: description || ''
    }
  })

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

  revalidatePath('/admin')
  return { success: true, formId: form.id }
}

export async function deleteForm(id: string) {
  await checkAdmin()

  await prisma.field.deleteMany({
    where: {
      section: {
        formId: id
      }
    }
  })

  await prisma.section.deleteMany({
    where: {
      formId: id
    }
  })

  await prisma.submission.deleteMany({
    where: {
      formId: id
    }
  })

  await prisma.form.delete({
    where: {
      id
    }
  })

  revalidatePath('/admin')
  return { success: true }
}

export async function getForm(id: string) {
  await checkAdmin()

  const form = await prisma.form.findUnique({
    where: { id },
    include: {
      sections: {
        include: {
          fields: true
        }
      }
    }
  })

  if (!form) {
    throw new Error('Form not found')
  }

  return form
}

export async function updateForm(id: string, title: string, description: string, sections: CreateSectionInput[]) {
  await checkAdmin()

  if (sections.length > 2 || sections.some(s => s.fields.length > 3)) {
    throw new Error('Limits exceeded: max 2 sections, 3 fields each')
  }

  if (sections.some(s => !s.name.trim() || s.fields.some(f => !f.label.trim()))) {
    throw new Error('Please fill in all section names and field labels')
  }

  await prisma.field.deleteMany({
    where: {
      section: {
        formId: id
      }
    }
  })

  await prisma.section.deleteMany({
    where: {
      formId: id
    }
  })

  await prisma.form.update({
    where: { id },
    data: {
      title,
      description
    }
  })

  for (const sec of sections) {
    const createdSec = await prisma.section.create({
      data: { name: sec.name, formId: id }
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

  revalidatePath('/admin')
  revalidatePath(`/admin/edit/${id}`)
  return { success: true }
}

export async function getFormsWithSubmissions(): Promise<FormWithSubmissions[]> {
  const forms = await prisma.form.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      _count: {
        select: { submissions: true }
      }
    }
  })

  return forms.map(form => ({
    id: form.id,
    title: form.title,
    description: form.description,
    createdAt: form.createdAt,
    submissionsCount: form._count.submissions
  }))
}