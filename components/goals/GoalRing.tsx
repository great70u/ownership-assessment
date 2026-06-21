'use client'
import { formatCurrency, percentOf } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import { Zap } from 'lucide-react'
import type { Goal } from '@/types'

const COLORS = ['#3D7FFF', '#00D4D4', '#9B7EDE', '#34D399', '#FFB84D']

interface Props {
  goal: Goal
  index: number
}

export function GoalRing({ goal, index }: Props) {
  const pct = percentOf(goal.currentAmount, goal.targetAmount)
  const color = COLORS[index % COLORS.length]
  const remaining = goal.targetAmount - goal.currentAmount
  const daysLeft = Math.ceil(
    (new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )

  const radius = 50
  const circumference = 2 * Math.PI * radius
  const progress = (pct / 100) * circumference

  return (
    <div className="bg-surface rounded-lg border border-border p-5">
      <div className="flex items-start gap-4">
        {/* Ring */}
        <div className="relative w-24 h-24 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r={radius} fill="none" stroke="#20242E" strokeWidth="8" />
            <circle
              cx="60" cy="60" r={radius}
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${progress} ${circumference - progress}`}
              style={{ transition: 'stroke-dasharray 0.8s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl">{goal.emoji}</span>
            <span className="text-sm font-bold" style={{ color }}>{pct}%</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-primary mb-0.5">{goal.name}</h3>
          <p className="text-xs text-secondary mb-2">
            {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
          </p>
          <Progress value={pct} color={color} className="mb-2" />
          <div className="flex justify-between text-xs text-secondary">
            <span>{formatCurrency(remaining)} to go</span>
            <span>{daysLeft > 0 ? `${daysLeft}d left` : 'Overdue'}</span>
          </div>

          {goal.isAutoSave && (
            <div className="mt-2 flex items-center gap-1 text-xs" style={{ color }}>
              <Zap className="w-3 h-3" />
              Auto-save {formatCurrency(goal.autoSaveAmount)}/mo
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
