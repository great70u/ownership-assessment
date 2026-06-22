'use client'
import { create } from 'zustand'
import type { Account, Transaction, Budget, Goal, SavingsRule } from '@/types'

interface UserInfo {
  id: string
  email: string
  name: string
  avatarUrl: string | null
  healthScore: number
  referralCode: string
}

// Raw rows as returned by /api/data (transactions/goals carry no joined relations).
type RawAccount = Omit<Account, 'lastSynced'> & { lastSynced?: string }
type RawTransaction = Omit<Transaction, 'account'>
type RawBudget = Budget
type RawGoal = Goal
type RawSavingsRule = Omit<SavingsRule, 'goal'>

interface DataState {
  user: UserInfo | null
  accounts: RawAccount[]
  transactions: RawTransaction[]
  budgets: RawBudget[]
  goals: RawGoal[]
  savingsRules: RawSavingsRule[]
  source: 'demo' | 'database' | null
  loaded: boolean
  error: string | null
  loadData: () => Promise<void>
}

export const useDataStore = create<DataState>((set, get) => ({
  user: null,
  accounts: [],
  transactions: [],
  budgets: [],
  goals: [],
  savingsRules: [],
  source: null,
  loaded: false,
  error: null,

  loadData: async () => {
    if (get().loaded) return
    try {
      const res = await fetch('/api/data')
      if (!res.ok) throw new Error(`Failed to load data (${res.status})`)
      const data = await res.json()
      set({
        user: data.user,
        accounts: data.accounts,
        transactions: data.transactions,
        budgets: data.budgets,
        goals: data.goals,
        savingsRules: data.savingsRules,
        source: data.source,
        loaded: true,
        error: null,
      })
    } catch (err) {
      console.error(err)
      set({ error: err instanceof Error ? err.message : 'Failed to load data' })
    }
  },
}))
