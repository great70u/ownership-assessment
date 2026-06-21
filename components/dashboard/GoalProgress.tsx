'use client'
import Link from 'next/link'
import { getDemoGoals } from '@/lib/demo-store'
import { formatCurrency, percentOf } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'

const GOAL_COLORS = ['#3D7FFF', '#00D4D4', '#9B7EDE']

export function GoalProgress() {
  const goals = getDemoGoals()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Goal Progress</CardTitle>
        <Link
          href="/dashboard/budgets"
          className="text-xs text-accent hover:text-accent/80 flex items-center gap-1"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </CardHeader>
      <CardContent className="pt-2 space-y-4">
        {goals.map((goal, i) => {
          const pct = percentOf(goal.currentAmount, goal.targetAmount)
          const color = GOAL_COLORS[i % GOAL_COLORS.length]
          const radius = 28
          const circumference = 2 * Math.PI * radius
          const progress = (pct / 100) * circumference

          return (
            <div key={goal.id} className="flex items-center gap-3">
              {/* Mini ring */}
              <div className="relative w-14 h-14 shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
                  <circle cx="36" cy="36" r={radius} fill="none" stroke="#20242E" strokeWidth="6" />
                  <circle
                    cx="36" cy="36" r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${progress} ${circumference - progress}`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color }}>
                  {pct}%
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span>{goal.emoji}</span>
                  <p className="text-sm font-medium text-primary truncate">{goal.name}</p>
                </div>
                <p className="text-xs text-secondary mt-0.5">
                  {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
                </p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
