'use client'
import { useFilterStore } from '@/store/filterStore'
import { getDemoStats, getDemoAccounts } from '@/lib/demo-store'
import { formatCurrency } from '@/lib/utils'
import { AccountFilter } from '@/components/shared/AccountFilter'
import { TrendingUp, TrendingDown } from 'lucide-react'

export function BalanceHero() {
  const { selectedAccountId } = useFilterStore()
  const stats = getDemoStats(selectedAccountId)
  const accounts = getDemoAccounts()

  return (
    <div className="gradient-bg rounded-xl p-6 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-white/70 text-sm mb-1">Total Balance</p>
            <p className="text-3xl font-display font-bold tracking-tight">
              {formatCurrency(stats.totalBalance)}
            </p>
          </div>
          <AccountFilter />
        </div>

        {/* Accounts row */}
        {selectedAccountId === 'all' && (
          <div className="flex gap-3 mb-5 overflow-x-auto pb-1">
            {accounts.map(acc => (
              <button
                key={acc.id}
                onClick={() => useFilterStore.getState().setAccount(acc.id)}
                className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5 shrink-0 hover:bg-white/25 transition-colors"
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: acc.color }} />
                <span className="text-xs font-medium">{acc.bankName}</span>
                <span className="text-xs text-white/70">{formatCurrency(acc.balance)}</span>
              </button>
            ))}
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingDown className="w-3.5 h-3.5 text-white/70" />
              <p className="text-white/70 text-xs">Spent this month</p>
            </div>
            <p className="text-lg font-bold">{formatCurrency(stats.totalSpent)}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-white/70" />
              <p className="text-white/70 text-xs">Saved this month</p>
            </div>
            <p className="text-lg font-bold">{formatCurrency(Math.max(0, stats.totalSaved))}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
