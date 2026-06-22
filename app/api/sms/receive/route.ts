import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Receives inbound SMS from Africa's Talking or Twilio.
// Parses the bank alert text via AI and returns structured transaction data.
// The client stores the result in Zustand (transactionStore).

async function parseAlertText(text: string): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/ai/parse-sms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ smsText: text }),
    })
    if (!res.ok) return null
    const { transaction } = await res.json()
    return transaction ?? null
  } catch {
    return null
  }
}

// Africa's Talking webhook (application/x-www-form-urlencoded)
export async function POST(req: NextRequest) {
  const contentType = req.headers.get('content-type') ?? ''

  let from = ''
  let text = ''
  let id = ''

  if (contentType.includes('application/x-www-form-urlencoded')) {
    // Africa's Talking format
    const form = await req.formData()
    from = form.get('from') as string ?? ''
    text = form.get('text') as string ?? ''
    id = form.get('id') as string ?? ''
  } else {
    // Twilio format (also form-encoded but may arrive as JSON fallback)
    try {
      const body = await req.json()
      from = body.From ?? body.from ?? ''
      text = body.Body ?? body.text ?? ''
      id = body.MessageSid ?? body.id ?? ''
    } catch {
      const form = await req.formData()
      from = form.get('From') as string ?? form.get('from') as string ?? ''
      text = form.get('Body') as string ?? form.get('text') as string ?? ''
      id = form.get('MessageSid') as string ?? ''
    }
  }

  if (!text.trim()) {
    return NextResponse.json({ error: 'No SMS text received.' }, { status: 400 })
  }

  const transaction = await parseAlertText(text)

  if (!transaction) {
    // Not a bank alert we can parse — acknowledge but don't store
    return NextResponse.json({ received: true, parsed: false })
  }

  // Return parsed transaction — the mobile/web client stores it in Zustand
  // or a future webhook can write it directly to the DB
  return NextResponse.json({
    received: true,
    parsed: true,
    from,
    id,
    transaction,
  })
}

// Africa's Talking delivery report (GET)
export async function GET() {
  return new Response('OK', { status: 200 })
}
