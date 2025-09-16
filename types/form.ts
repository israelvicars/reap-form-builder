export type FieldType = 'text' | 'number';

export interface Field {
  id: string;
  label: string;
  type: FieldType | string; // Allow both strict types and Prisma string
}

export interface Section {
  id: string;
  name: string;
  fields: Field[];
}

export interface Form {
  id: string;
  sections: Section[];
  createdAt: Date;
}

export interface FormValues {
  [fieldId: string]: string | number;
}

export interface CreateSectionInput {
  name: string;
  fields: {
    label: string;
    type: FieldType;
  }[];
}

export interface CreateFormInput {
  sections: CreateSectionInput[];
}

export interface AIGenerateRequest {
  prompt: string;
}

export interface AIGenerateResponse {
  sections: CreateSectionInput[];
}