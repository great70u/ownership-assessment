'use client'
import { useFilterStore } from '@/store/filterStore'
import { useTransactionStore } from '@/store/transactionStore'
import { getDemoTransactions } from '@/lib/demo-store'
import { CATEGORY_COLORS, CATEGORY_LABELS, CATEGORY_EMOJIS } from '@/types'
import { formatCurrency, formatDate, getDateGroupLabel } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { TransactionDetail } from './TransactionDetail'
import { Trash2 } from 'lucide-react'
import type { Transaction, TransactionCategory } from '@/types'

export function TransactionTable() {
  const { selectedAccountId, selectedCategory, selectedType, searchQuery } = useFilterStore()
  const { userTransactions, removeTransaction } = useTransactionStore()
  const [selected, setSelected] = useState<Transaction | null>(null)

  const demoTxns = getDemoTransactions(
    selectedAccountId,
    selectedCategory !== 'ALL' ? selectedCategory : undefined,
    selectedType !== 'ALL' ? selectedType : undefined,
  )

  // Filter user transactions the same way
  let userFiltered = userTransactions
  if (selectedAccountId !== 'all') userFiltered = userFiltered.filter(t => t.accountId === selectedAccountId)
  if (selectedCategory !== 'ALL') userFiltered = userFiltered.filter(t => t.category === selectedCategory)
  if (selectedType !== 'ALL') userFiltered = userFiltered.filter(t => t.type === selectedType)

  let txns: Transaction[] = [...userFiltered, ...demoTxns]

  if (searchQuery) {
    const q = searchQuery.toLowerCase()
    txns = txns.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.meta.toLowerCase().includes(q) ||
      CATEGORY_LABELS[t.category].toLowerCase().includes(q)
    )
  }

  // Sort newest first
  txns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const groups: Record<string, Transaction[]> = {}
  txns.forEach(tx => {
    const label = getDateGroupLabel(tx.date)
    if (!groups[label]) groups[label] = []
    groups[label].push(tx)
  })

  return (
    <div className="flex gap-5">
      <div className="flex-1 space-y-5">
        {Object.entries(groups).length === 0 && (
          <div className="text-center text-secondary text-sm py-20">No transactions found.</div>
        )}
        {Object.entries(groups).map(([label, items]) => (
          <div key={label}>
            <h3 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2 px-1">{label}</h3>
            <div className="bg-surface rounded-lg border border-border overflow-hidden">
              {items.map((tx, i) => {
                const isCredit = tx.type === 'CREDIT'
                const isSelected = selected?.id === tx.id
                const isUserAdded = tx.id.startsWith('user-')
                return (
                  <div
                    key={tx.id}
                    className={`flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-surface2 ${i < items.length - 1 ? 'border-b border-border/50' : ''} ${isSelected ? 'bg-surface2' : ''}`}
                  >
                    <button
                      onClick={() => setSelected(isSelected ? null : tx)}
                      className="flex items-center gap-4 flex-1 text-left min-w-0"
                    >
                      <div
                        className="w-10 h-10 rounded-md flex items-center justify-center text-lg shrink-0"
                        style={{ backgroundColor: `${CATEGORY_COLORS[tx.category as TransactionCategory]}20` }}
                      >
                        {CATEGORY_EMOJIS[tx.category as TransactionCategory]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-primary">{tx.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-secondary">{tx.meta}</span>
                          {tx.isAutoCategorized && (
                            <Badge variant="default" className="text-[10px] px-1.5 py-0">AI</Badge>
                          )}
                          {tx.isRecurring && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">Recurring</Badge>
                          )}
                          {isUserAdded && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-accent/40 text-accent">New</Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-sm font-semibold ${isCredit ? 'text-success' : 'text-primary'}`}>
                          {isCredit ? '+' : '-'}{formatCurrency(tx.amount)}
                        </p>
                        <p className="text-xs text-secondary mt-0.5">
                          {CATEGORY_LABELS[tx.category as TransactionCategory]}
                        </p>
                      </div>
                    </button>
                    {isUserAdded && (
                      <button
                        onClick={() => { if (selected?.id === tx.id) setSelected(null); removeTransaction(tx.id) }}
                        className="text-secondary hover:text-red-400 transition shrink-0 ml-2"
                        title="Delete transaction"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="w-[300px] shrink-0">
          <TransactionDetail transaction={selected} onClose={() => setSelected(null)} />
        </div>
      )}
    </div>
  )
}
