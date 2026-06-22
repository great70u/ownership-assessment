import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))

  const response = NextResponse.json({ success: true })

  response.cookies.set('zinkro_onboarded', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  })

  // Store lightweight onboarding profile in a separate cookie for personalisation
  const profile = {
    banks: body.banks ?? [],
    incomeRange: body.incomeRange ?? '',
    goals: body.goals ?? [],
    smsConnected: body.smsConnected ?? false,
    identityVerified: body.identityVerified ?? false,
    identityType: body.identityType ?? null,
    completedAt: new Date().toISOString(),
  }
  response.cookies.set('zinkro_profile', Buffer.from(JSON.stringify(profile)).toString('base64'), {
    httpOnly: false, // readable client-side for personalisation
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  })

  return response
}
