'use client'
import { CATEGORY_COLORS, CATEGORY_LABELS, CATEGORY_EMOJIS } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { X, Bot, RefreshCw, StickyNote } from 'lucide-react'
import type { Transaction, TransactionCategory } from '@/types'

interface Props {
  transaction: Transaction
  onClose: () => void
}

export function TransactionDetail({ transaction: tx, onClose }: Props) {
  const isCredit = tx.type === 'CREDIT'
  const color = CATEGORY_COLORS[tx.category as TransactionCategory]

  return (
    <div className="bg-surface rounded-lg border border-border overflow-hidden sticky top-6">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-sm font-semibold text-primary">Transaction Detail</h3>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-surface2 text-secondary"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Amount */}
      <div className="p-5 text-center border-b border-border">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3"
          style={{ backgroundColor: `${color}20` }}
        >
          {CATEGORY_EMOJIS[tx.category as TransactionCategory]}
        </div>
        <p className={`text-2xl font-display font-bold ${isCredit ? 'text-success' : 'text-primary'}`}>
          {isCredit ? '+' : '-'}{formatCurrency(tx.amount)}
        </p>
        <p className="text-sm text-secondary mt-1">{tx.name}</p>
        <p className="text-xs text-secondary">{tx.meta}</p>
      </div>

      {/* Details */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-secondary">Date</span>
          <span className="text-primary">{formatDate(tx.date)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-secondary">Category</span>
          <span className="font-medium" style={{ color }}>
            {CATEGORY_LABELS[tx.category as TransactionCategory]}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-secondary">Account</span>
          <span className="text-primary">{tx.account?.bankName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-secondary">Type</span>
          <span className="text-primary">{tx.type === 'CREDIT' ? 'Income' : 'Expense'}</span>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 pt-2">
          {tx.isAutoCategorized && (
            <Badge variant="default" className="flex items-center gap-1">
              <Bot className="w-3 h-3" /> AI Categorized
            </Badge>
          )}
          {tx.isRecurring && (
            <Badge variant="outline" className="flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> Recurring
            </Badge>
          )}
        </div>

        {tx.note && (
          <div className="pt-2">
            <div className="flex items-center gap-1.5 text-xs text-secondary mb-1.5">
              <StickyNote className="w-3 h-3" />
              Note
            </div>
            <p className="text-sm text-primary bg-surface2 rounded-md p-3">{tx.note}</p>
          </div>
        )}

        {tx.rawSmsText && (
          <div className="pt-2">
            <p className="text-xs text-secondary mb-1.5">Raw SMS</p>
            <p className="text-xs text-secondary bg-surface2 rounded-md p-3 font-mono leading-relaxed">
              {tx.rawSmsText}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
