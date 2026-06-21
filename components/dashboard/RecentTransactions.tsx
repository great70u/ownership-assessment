'use client'
import Link from 'next/link'
import { useFilterStore } from '@/store/filterStore'
import { getDemoTransactions } from '@/lib/demo-store'
import { CATEGORY_COLORS, CATEGORY_LABELS, CATEGORY_EMOJIS } from '@/types'
import { formatCurrency, formatRelativeDate } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'
import type { TransactionCategory } from '@/types'

export function RecentTransactions() {
  const { selectedAccountId } = useFilterStore()
  const transactions = getDemoTransactions(selectedAccountId).slice(0, 5)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Transactions</CardTitle>
        <Link
          href="/dashboard/transactions"
          className="text-xs text-accent hover:text-accent/80 flex items-center gap-1"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </CardHeader>
      <CardContent className="pt-2 pb-2">
        <div className="space-y-0.5">
          {transactions.map(tx => {
            const isCredit = tx.type === 'CREDIT'
            return (
              <div
                key={tx.id}
                className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-md flex items-center justify-center text-base shrink-0"
                    style={{
                      backgroundColor: `${CATEGORY_COLORS[tx.category as TransactionCategory]}20`,
                    }}
                  >
                    {CATEGORY_EMOJIS[tx.category as TransactionCategory]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary">{tx.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-secondary">{formatRelativeDate(tx.date)}</span>
                      {tx.isAutoCategorized && (
                        <Badge variant="default" className="text-[10px] px-1.5 py-0">
                          AI
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <span
                  className={`text-sm font-semibold ${isCredit ? 'text-success' : 'text-primary'}`}
                >
                  {isCredit ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
