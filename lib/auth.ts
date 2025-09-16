import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function checkAdmin() {
  const cookie = (await cookies()).get('isAdmin')?.value
  if (cookie !== 'true') {
    redirect('/login')
  }
}