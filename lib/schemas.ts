import { z } from 'zod'

export const FieldTypeSchema = z.enum(['text', 'number'])

export const FieldInputSchema = z.object({
  label: z.string(),
  type: FieldTypeSchema,
})

export const SectionInputSchema = z.object({
  name: z.string(),
  fields: z.array(FieldInputSchema).max(3),
})

export const FormGenerationSchema = z.object({
  title: z.string(),
  description: z.string(),
  sections: z.array(SectionInputSchema).max(2),
})

export const AIGenerateRequestSchema = z.object({
  prompt: z.string(),
})