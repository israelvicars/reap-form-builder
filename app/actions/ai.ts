'use server'

import OpenAI from 'openai'
import { checkAdmin } from '@/lib/auth'
import { AIGenerateResponse } from '@/types/form'

export async function generateFormWithAI(prompt: string): Promise<AIGenerateResponse> {
  await checkAdmin()

  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-key') {
    throw new Error('OpenAI API key not configured')
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Output JSON: {sections: [{name: string, fields: [{label: string, type: "text"|"number"}]}]}. Limit to 2 sections, 3 fields each. Always return valid JSON only.'
        },
        { role: 'user', content: `Suggest form sections and fields for: ${prompt}` }
      ],
      response_format: { type: "json_object" }
    })

    const json = JSON.parse(response.choices[0].message.content || '{}')

    // Ensure we respect limits
    json.sections = json.sections?.slice(0, 2) || []
    json.sections.forEach((s: { fields?: { type?: string }[] }) => {
      s.fields = s.fields?.slice(0, 3) || []
      // Ensure field types are valid
      s.fields.forEach((f: { type?: string }) => {
        if (f.type !== 'text' && f.type !== 'number') {
          f.type = 'text'
        }
      })
    })

    return json as AIGenerateResponse
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw new Error('AI generation failed')
  }
}