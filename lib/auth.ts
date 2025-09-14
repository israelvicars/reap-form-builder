import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export function checkAdmin() {
  const cookie = cookies().get('isAdmin')?.value
  if (cookie !== 'true') {
    redirect('/login')
  }
}