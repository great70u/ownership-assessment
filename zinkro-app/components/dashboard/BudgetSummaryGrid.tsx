'use client'
import { useFilterStore } from '@/store/filterStore'
import { useBudgets } from '@/lib/demo-store'
import { CATEGORY_COLORS, CATEGORY_LABELS, CATEGORY_EMOJIS } from '@/types'
import { formatCurrency, percentOf } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { AlertTriangle } from 'lucide-react'
import type { TransactionCategory } from '@/types'

export function BudgetSummaryGrid() {
  const { selectedAccountId } = useFilterStore()
  const budgets = useBudgets(selectedAccountId)
  const overBudget = budgets.filter(b => b.spent > b.amount)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Budget Summary — June</CardTitle>
        {overBudget.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-warning">
            <AlertTriangle className="w-3.5 h-3.5" />
            {overBudget.length} over budget
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-3">
        <div className="grid grid-cols-2 gap-3">
          {budgets.map(b => {
            const pct = percentOf(b.spent, b.amount)
            const over = b.spent > b.amount
            const color = over ? '#FF6B6B' : CATEGORY_COLORS[b.category as TransactionCategory]

            return (
              <div key={b.id} className="bg-surface2 rounded-md p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span>{CATEGORY_EMOJIS[b.category as TransactionCategory]}</span>
                    <span className="text-xs font-medium text-primary">
                      {CATEGORY_LABELS[b.category as TransactionCategory]}
                    </span>
                  </div>
                  {over && <AlertTriangle className="w-3 h-3 text-error" />}
                </div>
                <Progress value={pct} color={color} className="mb-2" />
                <div className="flex justify-between text-xs">
                  <span className={over ? 'text-error' : 'text-secondary'}>
                    {formatCurrency(b.spent)}
                  </span>
                  <span className="text-secondary">{formatCurrency(b.amount)}</span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
