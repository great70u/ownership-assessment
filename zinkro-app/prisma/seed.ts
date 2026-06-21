import { PrismaClient } from '@prisma/client'
import {
  DEMO_USER,
  DEMO_ACCOUNTS,
  DEMO_TRANSACTIONS,
  DEMO_BUDGETS,
  DEMO_GOALS,
  DEMO_SAVINGS_RULES,
} from '../lib/seed-data'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Tomi Bello demo data...')

  await prisma.aiMessage.deleteMany()
  await prisma.savingsRule.deleteMany()
  await prisma.goal.deleteMany()
  await prisma.budget.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  await prisma.user.create({
    data: {
      id: DEMO_USER.id,
      email: DEMO_USER.email,
      name: DEMO_USER.name,
      avatarUrl: DEMO_USER.avatarUrl,
      healthScore: DEMO_USER.healthScore,
      referralCode: DEMO_USER.referralCode,
    },
  })
  console.log('✓ User created')

  for (const acc of DEMO_ACCOUNTS) {
    await prisma.account.create({
      data: {
        id: acc.id,
        userId: acc.userId,
        bankName: acc.bankName,
        accountNumber: acc.accountNumber,
        accountType: acc.accountType,
        balance: acc.balance,
        currency: acc.currency,
        color: acc.color,
        isPrimary: acc.isPrimary,
      },
    })
  }
  console.log(`✓ ${DEMO_ACCOUNTS.length} accounts created`)

  for (const tx of DEMO_TRANSACTIONS) {
    await prisma.transaction.create({
      data: {
        id: tx.id,
        userId: tx.userId,
        accountId: tx.accountId,
        name: tx.name,
        meta: tx.meta,
        amount: tx.amount,
        type: tx.type,
        category: tx.category,
        date: new Date(tx.date),
        isRecurring: tx.isRecurring,
        isAutoCategorized: tx.isAutoCategorized,
      },
    })
  }
  console.log(`✓ ${DEMO_TRANSACTIONS.length} transactions created`)

  for (const b of DEMO_BUDGETS) {
    await prisma.budget.create({
      data: {
        id: b.id,
        userId: b.userId,
        category: b.category,
        amount: b.amount,
        period: b.period,
        month: b.month,
        year: b.year,
      },
    })
  }
  console.log(`✓ ${DEMO_BUDGETS.length} budgets created`)

  for (const g of DEMO_GOALS) {
    await prisma.goal.create({
      data: {
        id: g.id,
        userId: g.userId,
        name: g.name,
        emoji: g.emoji,
        targetAmount: g.targetAmount,
        currentAmount: g.currentAmount,
        targetDate: new Date(g.targetDate),
        isAutoSave: g.isAutoSave,
        autoSaveAmount: g.autoSaveAmount,
      },
    })
  }
  console.log(`✓ ${DEMO_GOALS.length} goals created`)

  for (const sr of DEMO_SAVINGS_RULES) {
    await prisma.savingsRule.create({
      data: {
        id: sr.id,
        userId: sr.userId,
        type: sr.type,
        name: sr.name,
        amount: sr.amount,
        frequency: sr.frequency,
        goalId: sr.goalId,
        isActive: sr.isActive,
      },
    })
  }
  console.log(`✓ ${DEMO_SAVINGS_RULES.length} savings rules created`)

  console.log('\nSeed complete — Tomi Bello demo data loaded.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
