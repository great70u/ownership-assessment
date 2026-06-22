'use client'
import { useState } from 'react'
import { useBudgets, useGoals, useSavingsRules } from '@/lib/demo-store'
import { BudgetCard } from '@/components/budgets/BudgetCard'
import { GoalRing } from '@/components/goals/GoalRing'
import { SpendingDonut } from '@/components/dashboard/SpendingDonut'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { AccountFilter } from '@/components/shared/AccountFilter'
import { useFilterStore } from '@/store/filterStore'
import { Zap, RefreshCw, ArrowUpDown, AlertTriangle, ToggleLeft, ToggleRight } from 'lucide-react'
import type { SavingsRuleType } from '@/types'

const TABS = ['Budgets', 'Goals', 'Savings'] as const
type Tab = typeof TABS[number]

const RULE_ICONS: Record<SavingsRuleType, React.ElementType> = {
  ROUND_UP: ArrowUpDown,
  AUTO_SAVE: Zap,
  SWEEP: RefreshCw,
}

export default function BudgetsPage() {
  const [tab, setTab] = useState<Tab>('Budgets')
  const { selectedAccountId } = useFilterStore()
  const budgets = useBudgets(selectedAccountId)
  const goals = useGoals()
  const rules = useSavingsRules()

  const overBudget = budgets.filter(b => b.spent > b.amount)

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary">Budgets & Goals</h1>
          <p className="text-secondary text-sm mt-1">Track spending limits, savings goals, and automation rules</p>
        </div>
        <AccountFilter />
      </div>

      {/* Over-budget alert */}
      {overBudget.length > 0 && (
        <div className="flex items-center gap-3 bg-error/10 border border-error/20 rounded-lg px-4 py-3 mb-5 text-sm">
          <AlertTriangle className="w-4 h-4 text-error shrink-0" />
          <p className="text-error">
            <span className="font-semibold">{overBudget.length} categor{overBudget.length > 1 ? 'ies' : 'y'}</span> over budget this month:
            {' '}{overBudget.map(b => b.category.charAt(0) + b.category.slice(1).toLowerCase()).join(', ')}
          </p>
        </div>
      )}

      {/* Segmented tabs */}
      <div className="flex bg-surface border border-border rounded-lg p-1 w-fit mb-6">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'px-5 py-2 text-sm font-medium rounded-md transition-all',
              tab === t ? 'bg-accent text-white' : 'text-secondary hover:text-primary'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Budgets Tab */}
      {tab === 'Budgets' && (
        <div className="grid grid-cols-[1fr_320px] gap-6">
          <div>
            <div className="grid grid-cols-2 gap-4">
              {budgets.map(b => <BudgetCard key={b.id} budget={b} />)}
            </div>
          </div>
          <SpendingDonut />
        </div>
      )}

      {/* Goals Tab */}
      {tab === 'Goals' && (
        <div className="space-y-4 max-w-2xl">
          {goals.map((g, i) => <GoalRing key={g.id} goal={g} index={i} />)}
        </div>
      )}

      {/* Savings Tab */}
      {tab === 'Savings' && (
        <div className="max-w-lg space-y-3">
          {rules.map(rule => {
            const Icon = RULE_ICONS[rule.type]
            return (
              <div key={rule.id} className="bg-surface rounded-lg border border-border p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-md gradient-bg flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-primary">{rule.name}</p>
                  <p className="text-xs text-secondary">
                    {rule.amount > 0 ? `${formatCurrency(rule.amount)} · ` : ''}{rule.frequency}
                    {rule.goal ? ` → ${rule.goal.name}` : ''}
                  </p>
                </div>
                <div className={`w-10 h-6 rounded-full flex items-center ${rule.isActive ? 'bg-success' : 'bg-border'} transition-colors`}>
                  <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform mx-1 ${rule.isActive ? 'translate-x-4' : ''}`} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
