import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { bvn } = await req.json()

  if (!bvn || !/^\d{11}$/.test(bvn)) {
    return NextResponse.json({ error: 'A valid 11-digit BVN is required.' }, { status: 400 })
  }

  // Live verification via Dojah when credentials are configured
  const appId = process.env.DOJAH_APP_ID
  const secretKey = process.env.DOJAH_SECRET_KEY

  if (appId && secretKey) {
    try {
      const res = await fetch('https://api.dojah.io/api/v1/kyc/bvn', {
        method: 'GET',
        headers: {
          AppId: appId,
          SecretKey: secretKey,
          'Content-Type': 'application/json',
        },
        // Dojah uses query param for GET-style BVN lookup
      })
      const data = await res.json()

      if (!res.ok || !data.entity) {
        return NextResponse.json(
          { error: data?.error ?? 'BVN verification failed. Please check the number and try again.' },
          { status: 400 },
        )
      }

      return NextResponse.json({
        verified: true,
        firstName: data.entity.first_name,
        lastName: data.entity.last_name,
      })
    } catch {
      return NextResponse.json({ error: 'Verification service unavailable. Please try again later.' }, { status: 503 })
    }
  }

  // Demo mode: accept any structurally valid BVN
  return NextResponse.json({
    verified: true,
    firstName: 'Verified',
    lastName: 'User',
    demo: true,
  })
}
