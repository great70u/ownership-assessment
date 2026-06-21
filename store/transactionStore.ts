'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Transaction } from '@/types'

interface TransactionStore {
  userTransactions: Transaction[]
  addTransaction: (t: Omit<Transaction, 'id' | 'userId'>) => void
  removeTransaction: (id: string) => void
  clearAll: () => void
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set) => ({
      userTransactions: [],
      addTransaction: (t) => {
        const newTx: Transaction = {
          ...t,
          id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          userId: 'demo',
        }
        set(state => ({ userTransactions: [newTx, ...state.userTransactions] }))
      },
      removeTransaction: (id) =>
        set(state => ({ userTransactions: state.userTransactions.filter(t => t.id !== id) })),
      clearAll: () => set({ userTransactions: [] }),
    }),
    { name: 'zinkro-user-transactions' }
  )
)
