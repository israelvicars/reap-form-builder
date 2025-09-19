'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CreateSectionInput, FieldType, Form } from '@/types/form'
import { createForm, updateForm } from '@/app/actions/forms'
import { generateFormWithAI } from '@/app/actions/ai'

interface FormEditorProps {
  initialForm?: Form
  isEditing?: boolean
}

export default function FormEditor({ initialForm, isEditing = false }: FormEditorProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [sections, setSections] = useState<CreateSectionInput[]>([
    { name: '', fields: [] }
  ])
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (initialForm && isEditing) {
      setTitle(initialForm.title || '')
      setDescription(initialForm.description || '')
      if (initialForm.sections && initialForm.sections.length > 0) {
        setSections(initialForm.sections.map(section => ({
          name: section.name,
          fields: section.fields.map(field => ({
            label: field.label,
            type: field.type as FieldType
          }))
        })))
      }
    }
  }, [initialForm, isEditing])

  const addSection = () => {
    if (sections.length < 2) {
      setSections([...sections, { name: '', fields: [] }])
    }
  }

  const addField = (secIdx: number) => {
    if (sections[secIdx].fields.length < 3) {
      const newSecs = [...sections]
      newSecs[secIdx].fields.push({ label: '', type: 'text' })
      setSections(newSecs)
    }
  }

  const updateSection = (secIdx: number, name: string) => {
    const newSecs = [...sections]
    newSecs[secIdx].name = name
    setSections(newSecs)
  }

  const updateField = (
    secIdx: number,
    fieldIdx: number,
    key: 'label' | 'type',
    value: string
  ) => {
    const newSecs = [...sections]
    if (key === 'type') {
      newSecs[secIdx].fields[fieldIdx][key] = value as FieldType
    } else {
      newSecs[secIdx].fields[fieldIdx][key] = value
    }
    setSections(newSecs)
  }

  const removeSection = (secIdx: number) => {
    if (sections.length > 1) {
      setSections(sections.filter((_, idx) => idx !== secIdx))
    }
  }

  const removeField = (secIdx: number, fieldIdx: number) => {
    const newSecs = [...sections]
    newSecs[secIdx].fields = newSecs[secIdx].fields.filter((_, idx) => idx !== fieldIdx)
    setSections(newSecs)
  }

  const generateAI = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    try {
      const result = await generateFormWithAI(prompt)
      setTitle(result.title)
      setDescription(result.description)
      setSections(result.sections)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'AI generation failed')
    } finally {
      setLoading(false)
    }
  }

  const save = async () => {
    setLoading(true)
    try {
      let result
      if (isEditing && initialForm) {
        result = await updateForm(initialForm.id, title, description, sections)
      } else {
        result = await createForm(title, description, sections)
      }
      if (result.success) {
        router.push('/admin')
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save form')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Form' : 'Create New Form'}
          </h1>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">AI Assistant (Optional)</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'A job application form' or 'Customer feedback survey'"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 placeholder-gray-500 px-4"
            />
            <button
              onClick={generateAI}
              disabled={loading || !prompt.trim()}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded"
            >
              {loading ? 'Generating...' : 'Generate with AI'}
            </button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Form Details</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter form title"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 placeholder-gray-500 px-4"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description (optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter form description"
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 placeholder-gray-500 px-4"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {sections.map((sec, secIdx) => (
            <div key={secIdx} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Section {secIdx + 1}
                </h3>
                {sections.length > 1 && (
                  <button
                    onClick={() => removeSection(secIdx)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove Section
                  </button>
                )}
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  value={sec.name}
                  onChange={(e) => updateSection(secIdx, e.target.value)}
                  placeholder="Section Name"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 placeholder-gray-500 px-4"
                />
              </div>

              <div className="space-y-3">
                {sec.fields.map((field, fieldIdx) => (
                  <div key={fieldIdx} className="flex gap-3 items-center">
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => updateField(secIdx, fieldIdx, 'label', e.target.value)}
                      placeholder="Field Label"
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 placeholder-gray-500 px-4"
                    />
                    <select
                      value={field.type}
                      onChange={(e) => updateField(secIdx, fieldIdx, 'type', e.target.value)}
                      className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                    </select>
                    <button
                      onClick={() => removeField(secIdx, fieldIdx)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {sec.fields.length < 3 && (
                <button
                  onClick={() => addField(secIdx)}
                  className="mt-3 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add Field
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between">
          {sections.length < 2 && (
            <button
              onClick={addSection}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Section
            </button>
          )}
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/admin')}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              onClick={save}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded"
            >
              {loading ? 'Saving...' : (isEditing ? 'Update Form' : 'Save Form')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}