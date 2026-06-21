import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

export async function POST(req: NextRequest) {
  try {
    const { smsText } = await req.json()

    if (!smsText?.trim()) {
      return Response.json({ error: 'SMS text is required' }, { status: 400 })
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 400 })
    }

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      messages: [
        {
          role: 'user',
          content: `Extract transaction data from this Nigerian bank SMS. Return ONLY valid JSON with these fields:
{
  "name": "merchant or transaction name",
  "meta": "brief description",
  "amount": number (in Naira, no symbols),
  "type": "DEBIT" or "CREDIT",
  "category": one of FEEDING|TRANSPORT|UTILITIES|GIFTS|RENT|INCOME|OTHER,
  "date": "YYYY-MM-DD"
}

SMS: "${smsText}"`,
        },
      ],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return Response.json({ error: 'Could not parse transaction from SMS' }, { status: 422 })
    }

    const transaction = JSON.parse(jsonMatch[0])
    return Response.json({ transaction, isAutoCategorized: true })
  } catch (error) {
    console.error('SMS parse error:', error)
    return Response.json({ error: 'Failed to parse SMS' }, { status: 500 })
  }
}
