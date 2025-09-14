import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white shadow rounded-lg p-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Reap Multi-Form Builder
        </h1>
        <p className="text-gray-600 mb-8">
          Create custom forms with AI assistance and share them with the world.
        </p>
        <Link
          href="/login"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-md text-lg"
        >
          Admin Login
        </Link>
      </div>
    </div>
  )
}
