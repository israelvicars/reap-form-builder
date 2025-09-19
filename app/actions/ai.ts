'use server'

import OpenAI from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import { checkAdmin } from '@/lib/auth'
import { AIGenerateResponse } from '@/types/form'
import { FormGenerationSchema } from '@/lib/schemas'

export async function generateFormWithAI(prompt: string): Promise<AIGenerateResponse> {
  await checkAdmin()

  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-key') {
    throw new Error('OpenAI API key not configured')
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that generates complete forms including title, description, sections and fields based on user requirements. Create logical, well-organized form structures with appropriate titles and descriptions.'
        },
        {
          role: 'user',
          content: `Create a complete form (title, description, sections, and fields) for: ${prompt}. Limit to 2 sections with up to 3 fields each. Provide a clear, descriptive title and a brief description explaining the form's purpose.`
        }
      ],
      response_format: zodResponseFormat(FormGenerationSchema, 'form_generation')
    })

    const message = completion.choices[0]?.message
    
    if (message.refusal) {
      console.error('OpenAI refused request:', message.refusal)
      throw new Error('Request was refused by AI safety systems')
    }

    if (message.content) {
      const parsed = FormGenerationSchema.parse(JSON.parse(message.content))
      return parsed as AIGenerateResponse
    }

    throw new Error('No content received from OpenAI')
    
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw new Error('AI generation failed')
  }
}