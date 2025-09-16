'use client'
import { useState } from 'react'
import { Form, FormValues } from '@/types/form'

interface FormRendererProps {
  form: Form
}

export default function FormRenderer({ form }: FormRendererProps) {
  const [submitted, setSubmitted] = useState(false)
  const [values, setValues] = useState<FormValues>({})
  const [loading, setLoading] = useState(false)

  const handleChange = (fieldId: string, value: string) => {
    setValues({ ...values, [fieldId]: value })
  }

  const submit = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formId: form.id, data: values }),
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        alert('Submission failed')
      }
    } catch {
      alert('Submission failed')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white shadow rounded-lg p-6 text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank you!</h2>
          <p className="text-gray-600">Your form has been submitted successfully.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Form</h1>

            <div className="space-y-8">
              {form.sections.map((section) => (
                <div key={section.id}>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {section.name}
                  </h2>
                  <div className="space-y-4">
                    {section.fields.map((field) => (
                      <div key={field.id}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.label}
                        </label>
                        <input
                          type={field.type === 'number' ? 'number' : 'text'}
                          onChange={(e) => handleChange(field.id, e.target.value)}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 placeholder-gray-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <button
                onClick={submit}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-md text-lg"
              >
                {loading ? 'Submitting...' : 'Submit Form'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}