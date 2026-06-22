'use client'
// Data access hooks. These read from the client data store (hydrated once from
// /api/data, which serves either the live database or in-memory demo data) and
// apply the same filtering/aggregation the app has always used.

import { useDataStore } from '@/store/dataStore'
import type { Transaction, TransactionCategory, Account, Budget, Goal } from '@/types'

export function useUser() {
  return useDataStore((s) => s.user)
}

export function useAccounts(accountId?: string): Account[] {
  const accounts = useDataStore((s) => s.accounts)
  const mapped = accounts.map((a) => ({
    ...a,
    lastSynced: a.lastSynced ?? new Date().toISOString(),
  })) as Account[]
  if (accountId && accountId !== 'all') {
    return mapped.filter((a) => a.id === accountId)
  }
  return mapped
}

export function useTransactions(
  accountId?: string,
  category?: TransactionCategory,
  type?: 'DEBIT' | 'CREDIT'
): Transaction[] {
  const rawTxns = useDataStore((s) => s.transactions)
  const rawAccounts = useDataStore((s) => s.accounts)

  let txns: Transaction[] = rawTxns.map((t) => ({
    ...t,
    account: rawAccounts.find((a) => a.id === t.accountId),
  })) as Transaction[]

  if (accountId && accountId !== 'all') {
    txns = txns.filter((t) => t.accountId === accountId)
  }
  if (category) {
    txns = txns.filter((t) => t.category === category)
  }
  if (type) {
    txns = txns.filter((t) => t.type === type)
  }
  return txns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function useBudgets(accountId?: string): (Budget & { spent: number })[] {
  const txns = useTransactions(accountId)
  const budgets = useDataStore((s) => s.budgets)

  const june2026 = txns.filter((t) => {
    const d = new Date(t.date)
    return d.getMonth() === 5 && d.getFullYear() === 2026 && t.type === 'DEBIT'
  })

  return budgets.map((b) => {
    const spent = june2026
      .filter((t) => t.category === b.category)
      .reduce((sum, t) => sum + t.amount, 0)
    return { ...b, spent }
  })
}

export function useGoals(): Goal[] {
  return useDataStore((s) => s.goals)
}

export function useSavingsRules() {
  const rules = useDataStore((s) => s.savingsRules)
  const goals = useDataStore((s) => s.goals)
  return rules.map((r) => ({
    ...r,
    goal: goals.find((g) => g.id === r.goalId),
  }))
}

export function useStats(accountId?: string) {
  const accounts = useAccounts(accountId)
  const allAccounts = useAccounts()
  const txns = useTransactions(accountId)

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0)

  const juneTxns = txns.filter((t) => {
    const d = new Date(t.date)
    return d.getMonth() === 5 && d.getFullYear() === 2026
  })

  const totalSpent = juneTxns
    .filter((t) => t.type === 'DEBIT')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalIncome = juneTxns
    .filter((t) => t.type === 'CREDIT')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalSaved = totalIncome - totalSpent

  return {
    totalBalance,
    totalSpent,
    totalSaved,
    healthScore: { score: 78, label: 'Good' as const },
    accounts: allAccounts,
  }
}

export function useNetWorth(): { month: string; amount: number }[] {
  return [
    { month: 'Jan', amount: 285000 },
    { month: 'Feb', amount: 312000 },
    { month: 'Mar', amount: 298000 },
    { month: 'Apr', amount: 355000 },
    { month: 'May', amount: 420000 },
    { month: 'Jun', amount: 482300 },
  ]
}

export function useSpendingBreakdown(accountId?: string) {
  const txns = useTransactions(accountId)
  const juneTxns = txns.filter((t) => {
    const d = new Date(t.date)
    return d.getMonth() === 5 && d.getFullYear() === 2026 && t.type === 'DEBIT'
  })

  const byCategory: Record<string, number> = {}
  juneTxns.forEach((t) => {
    byCategory[t.category] = (byCategory[t.category] || 0) + t.amount
  })

  return Object.entries(byCategory).map(([category, amount]) => ({ category, amount }))
}
