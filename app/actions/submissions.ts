'use server'

import { prisma } from '@/lib/prisma'
import { FormValues } from '@/types/form'

export async function submitForm(formId: string, data: FormValues) {
  if (!formId) {
    throw new Error('Form ID is required')
  }

  const form = await prisma.form.findUnique({ where: { id: formId } })
  if (!form) {
    throw new Error('Form not found')
  }

  await prisma.submission.create({
    data: {
      formId,
      data: JSON.stringify(data),
    },
  })

  return { success: true }
}