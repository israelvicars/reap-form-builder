import { prisma } from '@/lib/prisma'
import { checkAdmin } from '@/lib/auth'
import Link from 'next/link'

export default async function ViewSubmissions({ params }: { params: { id: string } }) {
  checkAdmin()

  const form = await prisma.form.findUnique({
    where: { id: params.id },
    include: {
      sections: {
        include: { fields: true }
      },
      submissions: {
        orderBy: { createdAt: 'desc' }
      }
    },
  })

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white shadow rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Form Not Found</h2>
          <p className="text-gray-600">
            The form you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    )
  }

  // Create field lookup for display labels
  const fieldLookup: Record<string, { label: string; sectionName: string }> = {}
  form.sections.forEach(section => {
    section.fields.forEach(field => {
      fieldLookup[field.id] = {
        label: field.label,
        sectionName: section.name
      }
    })
  })

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Form Submissions</h1>
              <p className="text-gray-600 mt-2">
                {form.submissions.length} submission{form.submissions.length !== 1 ? 's' : ''} received
              </p>
            </div>
            <Link
              href="/admin"
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {form.submissions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No submissions yet. Share the form link to collect responses.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                      {form.sections.map(section =>
                        section.fields.map(field => (
                          <th
                            key={field.id}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {field.label}
                            <div className="text-xs text-gray-400 normal-case">
                              {section.name}
                            </div>
                          </th>
                        ))
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {form.submissions.map((submission) => (
                      <tr key={submission.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {submission.createdAt.toLocaleDateString()} {submission.createdAt.toLocaleTimeString()}
                        </td>
                        {form.sections.map(section =>
                          section.fields.map(field => (
                            <td
                              key={field.id}
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                            >
                              {(submission.data as Record<string, any>)[field.id] || '-'}
                            </td>
                          ))
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href={`/form/${form.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-900"
          >
            View Public Form →
          </Link>
        </div>
      </div>
    </div>
  )
}