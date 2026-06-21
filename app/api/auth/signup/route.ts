import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { name, email, phone, password } = await req.json()

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Name, email and password are required.' }, { status: 400 })
  }

  const user = { name: name.trim(), email: email.trim(), phone: phone?.trim() || '' }
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
