'use client'
import type { Form } from '@/types/form'

export default function FormsTable({ forms }: { forms: Form[] }) {

  if (forms.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">
        No forms created yet. Create your first form!
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Form ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Public Link
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {forms.map((form) => (
            <tr key={form.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {form.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {form.createdAt.toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600">
                <a
                  href={`/form/${form.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-900"
                >
                  /form/{form.id}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}