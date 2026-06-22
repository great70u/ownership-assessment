'use client'
import { CATEGORY_COLORS, CATEGORY_LABELS, CATEGORY_EMOJIS } from '@/types'
import { formatCurrency, percentOf } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import { AlertTriangle } from 'lucide-react'
import type { Budget, TransactionCategory } from '@/types'

interface Props {
  budget: Budget & { spent: number }
}

export function BudgetCard({ budget }: Props) {
  const pct = percentOf(budget.spent, budget.amount)
  const remaining = budget.amount - budget.spent
  const over = budget.spent > budget.amount
  const color = over ? '#FF6B6B' : CATEGORY_COLORS[budget.category as TransactionCategory]

  return (
    <div className="bg-surface rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-md flex items-center justify-center text-lg"
            style={{ backgroundColor: `${color}20` }}
          >
            {CATEGORY_EMOJIS[budget.category as TransactionCategory]}
          </div>
          <div>
            <p className="text-sm font-medium text-primary">
              {CATEGORY_LABELS[budget.category as TransactionCategory]}
            </p>
            <p className="text-xs text-secondary">{budget.period.toLowerCase()}</p>
          </div>
        </div>
        {over && <AlertTriangle className="w-4 h-4 text-error" />}
      </div>

      <Progress value={pct} color={color} className="mb-3" />

      <div className="flex justify-between text-xs">
        <div>
          <p className="text-secondary">Spent</p>
          <p className={`font-semibold mt-0.5 ${over ? 'text-error' : 'text-primary'}`}>
            {formatCurrency(budget.spent)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-secondary">Budget</p>
          <p className="font-semibold text-primary mt-0.5">{formatCurrency(budget.amount)}</p>
        </div>
        <div className="text-right">
          <p className="text-secondary">{over ? 'Over' : 'Left'}</p>
          <p className={`font-semibold mt-0.5 ${over ? 'text-error' : 'text-success'}`}>
            {formatCurrency(Math.abs(remaining))}
          </p>
        </div>
      </div>

      <div className="mt-2">
        <div className="flex justify-between text-xs text-secondary">
          <span>{pct}% used</span>
          <span>{100 - Math.min(100, pct)}% left</span>
        </div>
      </div>
    </div>
  )
}
