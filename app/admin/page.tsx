import { checkAdmin } from '@/lib/auth'
import Link from 'next/link'
import FormsTable from '@/components/FormsTable'
import { getFormsWithSubmissions } from '../actions/forms'

export default async function Admin() {
  await checkAdmin()
  const forms = await getFormsWithSubmissions()

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
            <FormsTable forms={forms} />
          </div>
        </div>
      </div>
    </div>
  )
}