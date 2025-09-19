'use client'
import { deleteForm } from '@/app/actions/forms'
import { useRouter } from 'next/navigation'
import type { FormWithSubmissions } from '@/types/form'

export default function FormsTable({ forms }: { forms: FormWithSubmissions[] }) {
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this form? This will also delete all submissions.')) {
      try {
        await deleteForm(id)
        router.refresh()
      } catch (error) {
        alert('Failed to delete form: ' + (error as Error).message)
      }
    }
  }

  const handleEdit = (id: string) => {
    router.push(`/admin/edit/${id}`)
  }

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
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Public Link
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Submissions
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {forms.map((form) => (
            <tr key={form.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {form.title || form.id}
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
                  Live Form
                </a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {form.submissionsCount}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(form.id)}
                    className="text-indigo-600 hover:text-indigo-900"
                    title="Edit form"
                    style={{ cursor: 'pointer' }}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(form.id)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete form"
                    style={{ cursor: 'pointer' }}
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}