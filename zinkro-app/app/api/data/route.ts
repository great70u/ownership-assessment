import { NextResponse } from 'next/server'
import {
  DEMO_USER,
  DEMO_ACCOUNTS,
  DEMO_TRANSACTIONS,
  DEMO_BUDGETS,
  DEMO_GOALS,
  DEMO_SAVINGS_RULES,
} from '@/lib/seed-data'

export const dynamic = 'force-dynamic'

// The single demo user. When auth is added later, derive this from the session.
const USER_ID = DEMO_USER.id

function demoPayload() {
  return {
    source: 'demo' as const,
    user: DEMO_USER,
    accounts: DEMO_ACCOUNTS,
    transactions: DEMO_TRANSACTIONS,
    budgets: DEMO_BUDGETS,
    goals: DEMO_GOALS,
    savingsRules: DEMO_SAVINGS_RULES,
  }
}

export async function GET() {
  // No database configured → serve in-memory demo data (app still works).
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(demoPayload())
  }

  try {
    const { prisma } = await import('@/lib/prisma')

    const [user, accounts, transactions, budgets, goals, savingsRules] =
      await Promise.all([
        prisma.user.findUnique({ where: { id: USER_ID } }),
        prisma.account.findMany({ where: { userId: USER_ID } }),
        prisma.transaction.findMany({
          where: { userId: USER_ID },
          orderBy: { date: 'desc' },
        }),
        prisma.budget.findMany({ where: { userId: USER_ID } }),
        prisma.goal.findMany({ where: { userId: USER_ID } }),
        prisma.savingsRule.findMany({ where: { userId: USER_ID } }),
      ])

    // If the database is reachable but empty, fall back to demo data.
    if (!user || accounts.length === 0) {
      return NextResponse.json(demoPayload())
    }

    return NextResponse.json({
      source: 'database' as const,
      user,
      accounts,
      transactions: transactions.map((t) => ({
        ...t,
        date: t.date.toISOString(),
      })),
      budgets,
      goals: goals.map((g) => ({ ...g, targetDate: g.targetDate.toISOString() })),
      savingsRules,
    })
  } catch (err) {
    console.error('Failed to load data from database, using demo data:', err)
    return NextResponse.json(demoPayload())
  }
}
