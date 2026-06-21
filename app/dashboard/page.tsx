import { BalanceHero } from '@/components/dashboard/BalanceHero'
import { HealthScoreRing } from '@/components/dashboard/HealthScoreRing'
import { NetWorthChart } from '@/components/dashboard/NetWorthChart'
import { SpendingDonut } from '@/components/dashboard/SpendingDonut'
import { BudgetSummaryGrid } from '@/components/dashboard/BudgetSummaryGrid'
import { RecentTransactions } from '@/components/dashboard/RecentTransactions'
import { GoalProgress } from '@/components/dashboard/GoalProgress'
import { AiInsights } from '@/components/dashboard/AiInsights'

export default function DashboardPage() {
  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-primary">
          Good morning, Tomi 👋
        </h1>
        <p className="text-secondary text-sm mt-1">Here&apos;s your financial snapshot for June 2026</p>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-[1fr_320px] gap-6">
        {/* Left column */}
        <div className="space-y-5">
          <BalanceHero />

          <div className="grid grid-cols-2 gap-5">
            <NetWorthChart />
            <SpendingDonut />
          </div>

          <BudgetSummaryGrid />

          <RecentTransactions />
        </div>

        {/* Right panel */}
        <div className="space-y-5">
          <HealthScoreRing score={78} label="Good" color="#3D7FFF" />
          <AiInsights />
          <GoalProgress />
        </div>
      </div>
    </div>
  )
}
