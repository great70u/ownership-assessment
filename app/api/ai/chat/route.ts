import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

const SYSTEM_PROMPT = `You are Zinkro AI, a personal finance assistant for Nigerian users. You help users understand their spending, manage budgets, track goals, and make smarter financial decisions.

The user (Tomi Bello) has the following financial profile:
- Total balance: ₦482,300 across 3 accounts (GTBank ₦312,800, Access Bank ₦145,500, Zenith Bank ₦24,000)
- Monthly income: ~₦450,000 salary + freelance income
- June 2026 spending: ₦252,750 across Feeding (₦61,700), Transport (₦35,300), Utilities (₦37,000), Gifts (₦41,150), Rent (₦120,000), Other (₦30,000)
- Health Score: 78/100 (Good)
- Goals: Lagos Trip (63%), Emergency Fund (17%), New Laptop (14%)
- Active budgets for all major categories

Be conversational, warm, and specific with Nigerian context (₦ currency, Nigerian banks, local expenses).
Give actionable advice. Keep responses concise (2-4 sentences) unless asked for detail.
Format numbers with ₦ symbol. Reference their actual data when relevant.`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'AI assistant requires ANTHROPIC_API_KEY to be configured.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text))
          }
        }
        controller.close()
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    console.error('AI chat error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate response' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
