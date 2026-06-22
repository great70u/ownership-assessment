import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { nin } = await req.json()

  if (!nin || !/^\d{11}$/.test(nin)) {
    return NextResponse.json({ error: 'A valid 11-digit NIN is required.' }, { status: 400 })
  }

  const appId = process.env.DOJAH_APP_ID
  const secretKey = process.env.DOJAH_SECRET_KEY

  if (appId && secretKey) {
    try {
      const res = await fetch(`https://api.dojah.io/api/v1/kyc/nin?nin=${nin}`, {
        headers: {
          AppId: appId,
          SecretKey: secretKey,
        },
      })
      const data = await res.json()

      if (!res.ok || !data.entity) {
        return NextResponse.json(
          { error: data?.error ?? 'NIN verification failed. Please check the number and try again.' },
          { status: 400 },
        )
      }

      return NextResponse.json({
        verified: true,
        firstName: data.entity.firstname,
        lastName: data.entity.surname,
      })
    } catch {
      return NextResponse.json({ error: 'Verification service unavailable. Please try again later.' }, { status: 503 })
    }
  }

  // Demo mode
  return NextResponse.json({ verified: true, firstName: 'Verified', lastName: 'User', demo: true })
}
