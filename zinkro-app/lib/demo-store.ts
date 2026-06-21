'use client'
// In-memory demo store — no DB required for the demo mode
// This lets the app work fully without Supabase credentials

import {
  DEMO_USER,
  DEMO_ACCOUNTS,
  DEMO_TRANSACTIONS,
  DEMO_BUDGETS,
  DEMO_GOALS,
  DEMO_SAVINGS_RULES,
} from './seed-data'
import type { Transaction, TransactionCategory, Account, Budget, Goal } from '@/types'

export function getDemoAccounts(accountId?: string): Account[] {
  const accounts = DEMO_ACCOUNTS.map(a => ({ ...a, lastSynced: new Date().toISOString() }))
  if (accountId && accountId !== 'all') {
    return accounts.filter(a => a.id === accountId)
  }
  return accounts
}

export function getDemoTransactions(accountId?: string, category?: TransactionCategory, type?: 'DEBIT' | 'CREDIT'): Transaction[] {
  let txns: Transaction[] = DEMO_TRANSACTIONS.map(t => ({
    ...t,
    account: DEMO_ACCOUNTS.find(a => a.id === t.accountId),
  })) as Transaction[]

  if (accountId && accountId !== 'all') {
    txns = txns.filter(t => t.accountId === accountId)
  }
  if (category) {
    txns = txns.filter(t => t.category === category)
  }
  if (type) {
    txns = txns.filter(t => t.type === type)
  }
  return txns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getDemoBudgets(accountId?: string): (Budget & { spent: number })[] {
  const txns = getDemoTransactions(accountId)
  const june2026 = txns.filter(t => {
    const d = new Date(t.date)
    return d.getMonth() === 5 && d.getFullYear() === 2026 && t.type === 'DEBIT'
  })

  return DEMO_BUDGETS.map(b => {
    const spent = june2026
      .filter(t => t.category === b.category)
      .reduce((sum, t) => sum + t.amount, 0)
    return { ...b, spent }
  })
}

export function getDemoGoals(): typeof DEMO_GOALS {
  return DEMO_GOALS
}

export function getDemoSavingsRules() {
  return DEMO_SAVINGS_RULES.map(r => ({
    ...r,
    goal: DEMO_GOALS.find(g => g.id === r.goalId),
  }))
}

export function getDemoStats(accountId?: string) {
  const accounts = getDemoAccounts(accountId)
  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0)

  const txns = getDemoTransactions(accountId)
  const juneTxns = txns.filter(t => {
    const d = new Date(t.date)
    return d.getMonth() === 5 && d.getFullYear() === 2026
  })

  const totalSpent = juneTxns
    .filter(t => t.type === 'DEBIT')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalIncome = juneTxns
    .filter(t => t.type === 'CREDIT')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalSaved = totalIncome - totalSpent

  return {
    totalBalance,
    totalSpent,
    totalSaved,
    healthScore: { score: 78, label: 'Good' as const },
    accounts: getDemoAccounts(),
  }
}

export function getDemoNetWorth(): { month: string; amount: number }[] {
  return [
    { month: 'Jan', amount: 285000 },
    { month: 'Feb', amount: 312000 },
    { month: 'Mar', amount: 298000 },
    { month: 'Apr', amount: 355000 },
    { month: 'May', amount: 420000 },
    { month: 'Jun', amount: 482300 },
  ]
}

export function getDemoSpendingBreakdown(accountId?: string) {
  const txns = getDemoTransactions(accountId)
  const juneTxns = txns.filter(t => {
    const d = new Date(t.date)
    return d.getMonth() === 5 && d.getFullYear() === 2026 && t.type === 'DEBIT'
  })

  const byCategory: Record<string, number> = {}
  juneTxns.forEach(t => {
    byCategory[t.category] = (byCategory[t.category] || 0) + t.amount
  })

  return Object.entries(byCategory).map(([category, amount]) => ({ category, amount }))
}

export { DEMO_USER, DEMO_ACCOUNTS }
