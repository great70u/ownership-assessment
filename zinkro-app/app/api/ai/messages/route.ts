import { NextRequest, NextResponse } from 'next/server'
import { DEMO_USER } from '@/lib/seed-data'

export const dynamic = 'force-dynamic'

const USER_ID = DEMO_USER.id

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ messages: [] })
  }

  try {
    const { prisma } = await import('@/lib/prisma')
    const rows = await prisma.aiMessage.findMany({
      where: { userId: USER_ID },
      orderBy: { createdAt: 'asc' },
      select: { id: true, role: true, content: true, createdAt: true },
    })

    return NextResponse.json({
      messages: rows.map(r => ({
        id: r.id,
        role: r.role === 'USER' ? 'user' : 'assistant',
        content: r.content,
        createdAt: r.createdAt.toISOString(),
      })),
    })
  } catch (err) {
    console.error('Failed to load chat history:', err)
    return NextResponse.json({ messages: [] })
  }
}

export async function POST(req: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ ok: true })
  }

  try {
    const { messages } = await req.json() as { messages: { role: string; content: string }[] }

    const { prisma } = await import('@/lib/prisma')
    await prisma.aiMessage.createMany({
      data: messages.map(m => ({
        userId: USER_ID,
        role: m.role.toUpperCase() as 'USER' | 'ASSISTANT',
        content: m.content,
      })),
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Failed to save chat messages:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
