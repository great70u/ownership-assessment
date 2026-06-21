'use client'
import { create } from 'zustand'
import type { TransactionCategory } from '@/types'

interface FilterState {
  selectedAccountId: string  // 'all' or specific account id
  selectedCategory: TransactionCategory | 'ALL'
  selectedType: 'ALL' | 'DEBIT' | 'CREDIT'
  searchQuery: string
  dateFrom: string | null
  dateTo: string | null

  setAccount: (id: string) => void
  setCategory: (cat: TransactionCategory | 'ALL') => void
  setType: (type: 'ALL' | 'DEBIT' | 'CREDIT') => void
  setSearch: (q: string) => void
  setDateRange: (from: string | null, to: string | null) => void
  reset: () => void
}

export const useFilterStore = create<FilterState>((set) => ({
  selectedAccountId: 'all',
  selectedCategory: 'ALL',
  selectedType: 'ALL',
  searchQuery: '',
  dateFrom: null,
  dateTo: null,

  setAccount: (id) => set({ selectedAccountId: id }),
  setCategory: (cat) => set({ selectedCategory: cat }),
  setType: (type) => set({ selectedType: type }),
  setSearch: (q) => set({ searchQuery: q }),
  setDateRange: (from, to) => set({ dateFrom: from, dateTo: to }),
  reset: () => set({
    selectedAccountId: 'all',
    selectedCategory: 'ALL',
    selectedType: 'ALL',
    searchQuery: '',
    dateFrom: null,
    dateTo: null,
  }),
}))
