import { prisma } from '@/lib/prisma'
import { checkAdmin } from '@/lib/auth'
import Link from 'next/link'

export default async function Admin() {
  checkAdmin()
  const forms = await prisma.form.findMany({
    select: {
      id: true,
      createdAt: true,
      _count: {
        select: { submissions: true }
      }
    }
  })

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Forms Dashboard</h1>
          <Link
            href="/admin/create"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          >
            Create New Form
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {forms.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No forms created yet. Create your first form!
              </p>
            ) : (
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submissions
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {form._count.submissions > 0 ? (
                            <Link
                              href={`/admin/submissions/${form.id}`}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              {form._count.submissions} submission{form._count.submissions !== 1 ? 's' : ''}
                            </Link>
                          ) : (
                            <span className="text-gray-400">No submissions</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}