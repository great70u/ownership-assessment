import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
  }

  const namePart = email.split('@')[0].replace(/[._-]/g, ' ')
  const name = namePart.replace(/\b\w/g, (c: string) => c.toUpperCase())
  const user = { name, email }

  const sessionData = Buffer.from(JSON.stringify(user)).toString('base64')
  const response = NextResponse.json({ success: true })
  response.cookies.set('zinkro_session', sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  return response
}
