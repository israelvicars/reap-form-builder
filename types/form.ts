import { Form as PrismaForm, Section as PrismaSection, Field as PrismaField } from '@prisma/client'

export type FieldType = 'text' | 'number'

export type Field = PrismaField

export type Section = PrismaSection & {
  fields: Field[]
}

export type Form = PrismaForm & {
  sections?: Section[]
}

export interface FormWithSubmissions {
  id: string
  title: string
  description: string
  createdAt: Date
  submissionsCount: number
}

export interface FormValues {
  [fieldId: string]: string | number
}

export interface CreateSectionInput {
  name: string
  fields: {
    label: string
    type: FieldType
  }[]
}

export interface CreateFormInput {
  sections: CreateSectionInput[]
}

export interface AIGenerateRequest {
  prompt: string
}

export interface AIGenerateResponse {
  title: string
  description: string
  sections: CreateSectionInput[]
}