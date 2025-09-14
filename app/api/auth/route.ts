import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()
  if (username === 'admin' && password === 'password123') {
    const res = NextResponse.json({ success: true })
    res.cookies.set('isAdmin', 'true', { httpOnly: true, path: '/' })
    return res
  }
  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
}