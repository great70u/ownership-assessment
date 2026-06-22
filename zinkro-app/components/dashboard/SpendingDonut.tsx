'use client'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { useFilterStore } from '@/store/filterStore'
import { useSpendingBreakdown } from '@/lib/demo-store'
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import type { TransactionCategory } from '@/types'

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface2 border border-border rounded-md px-3 py-2 text-xs shadow-lg">
      <p className="text-secondary mb-1">{CATEGORY_LABELS[payload[0].name as TransactionCategory]}</p>
      <p className="text-primary font-semibold">{formatCurrency(payload[0].value)}</p>
    </div>
  )
}

export function SpendingDonut() {
  const { selectedAccountId } = useFilterStore()
  const data = useSpendingBreakdown(selectedAccountId)

  const total = data.reduce((sum, d) => sum + d.amount, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Breakdown — June</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex items-center gap-4">
          <div className="w-[140px] h-[140px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  dataKey="amount"
                  nameKey="category"
                  paddingAngle={2}
                >
                  {data.map((entry, i) => (
                    <Cell
                      key={entry.category}
                      fill={CATEGORY_COLORS[entry.category as TransactionCategory] ?? '#8A8F98'}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 space-y-2">
            {data
              .sort((a, b) => b.amount - a.amount)
              .slice(0, 5)
              .map(d => (
                <div key={d.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: CATEGORY_COLORS[d.category as TransactionCategory] }}
                    />
                    <span className="text-xs text-secondary">
                      {CATEGORY_LABELS[d.category as TransactionCategory]}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-primary">{formatCurrency(d.amount)}</span>
                </div>
              ))}
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-border flex justify-between items-center">
          <span className="text-xs text-secondary">Total Spent</span>
          <span className="text-sm font-semibold text-primary">{formatCurrency(total)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
