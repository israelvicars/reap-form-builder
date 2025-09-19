import { getForm } from '@/app/actions/forms'
import FormEditor from '@/components/FormEditor'
import { notFound } from 'next/navigation'

interface EditFormPageProps {
  params: Promise<{ id: string }>
}

export default async function EditFormPage({ params }: EditFormPageProps) {
  const { id } = await params

  try {
    const form = await getForm(id)

    return <FormEditor initialForm={form} isEditing={true} />
  } catch {
    notFound()
  }
}