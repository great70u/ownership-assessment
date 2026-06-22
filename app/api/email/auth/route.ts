import { NextRequest, NextResponse } from 'next/server'

// Google OAuth for Gmail
function buildGoogleAuthUrl(callbackBase: string): string {
  const clientId = process.env.GOOGLE_CLIENT_ID
  if (!clientId) return `${callbackBase}/dashboard/settings?error=google_not_configured`

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${callbackBase}/api/email/callback/gmail`,
    response_type: 'code',
    scope: [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
    access_type: 'offline',
    prompt: 'consent',
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`
}

// Microsoft OAuth for Outlook
function buildMicrosoftAuthUrl(callbackBase: string): string {
  const clientId = process.env.MICROSOFT_CLIENT_ID
  if (!clientId) return `${callbackBase}/dashboard/settings?error=microsoft_not_configured`

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${callbackBase}/api/email/callback/outlook`,
    response_type: 'code',
    scope: 'Mail.Read User.Read offline_access',
    response_mode: 'query',
  })
  return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params}`
}

export async function GET(req: NextRequest) {
  const provider = req.nextUrl.searchParams.get('provider') ?? 'gmail'
  const base = process.env.NEXT_PUBLIC_APP_URL ?? `https://${req.headers.get('host')}`

  const url = provider === 'outlook' ? buildMicrosoftAuthUrl(base) : buildGoogleAuthUrl(base)
  return NextResponse.redirect(url)
}
