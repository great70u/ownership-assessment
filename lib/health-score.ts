import type { HealthScore } from '@/types'

interface HealthScoreInput {
  budgetAdherence: number  // 0-1: what fraction of budgets are within limit
  savingsRate: number      // 0-1: savings / income
  goalProgress: number     // 0-1: avg goal completion
  spendingDiversity: number // 0-1: not over-concentrated in one category
}

export function calculateHealthScore(input: HealthScoreInput): HealthScore {
  const raw =
    input.budgetAdherence * 30 +
    input.savingsRate * 30 +
    input.goalProgress * 25 +
    input.spendingDiversity * 15

  const score = Math.min(100, Math.max(0, Math.round(raw)))

  let label: HealthScore['label']
  let color: string

  if (score >= 80) {
    label = 'Excellent'
    color = '#34D399'
  } else if (score >= 60) {
    label = 'Good'
    color = '#3D7FFF'
  } else if (score >= 40) {
    label = 'Fair'
    color = '#FFB84D'
  } else {
    label = 'Poor'
    color = '#FF6B6B'
  }

  return {
    score,
    label,
    color,
    budgetAdherence: Math.round(input.budgetAdherence * 100),
    savingsRate: Math.round(input.savingsRate * 100),
    goalProgress: Math.round(input.goalProgress * 100),
    spendingDiversity: Math.round(input.spendingDiversity * 100),
  }
}
