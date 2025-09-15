import { prisma } from '@/lib/prisma'
import { checkAdmin } from '@/lib/auth'
import FormEditor from '@/components/FormEditor'

export default async function EditForm({ params }: { params: { id: string } }) {
  checkAdmin()

  const form = await prisma.form.findUnique({
    where: { id: params.id },
    include: { sections: { include: { fields: true } } },
  })

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white shadow rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Form Not Found</h2>
          <p className="text-gray-600">
            The form you&apos;re trying to edit doesn&apos;t exist.
          </p>
        </div>
      </div>
    )
  }

  return <FormEditor existingForm={form} />
}