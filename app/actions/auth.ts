'use server'

import { cookies } from 'next/headers'

export async function login(username: string, password: string) {
  if (username === 'admin' && password === 'password123') {
    const cookieStore = await cookies()
    cookieStore.set('isAdmin', 'true', { httpOnly: true, path: '/' })
    return { success: true }
  } else {
    throw new Error('Invalid credentials')
  }
}