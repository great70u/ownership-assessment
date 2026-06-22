'use client'
import { Card, CardContent } from '@/components/ui/card'

interface HealthScoreRingProps {
  score: number
  label: string
  color: string
}

export function HealthScoreRing({ score, label, color }: HealthScoreRingProps) {
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const progress = (score / 100) * circumference
  const gap = circumference - progress

  return (
    <Card>
      <CardContent className="flex flex-col items-center py-5">
        <p className="text-xs text-secondary mb-3">Financial Health</p>
        <div className="relative w-24 h-24">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Track */}
            <circle
              cx="50" cy="50" r={radius}
              fill="none"
              stroke="#20242E"
              strokeWidth="8"
            />
            {/* Progress */}
            <circle
              cx="50" cy="50" r={radius}
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${progress} ${gap}`}
              style={{ transition: 'stroke-dasharray 1s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-display font-bold text-primary">{score}</span>
          </div>
        </div>
        <span
          className="mt-2 text-sm font-semibold"
          style={{ color }}
        >
          {label}
        </span>
      </CardContent>
    </Card>
  )
}
