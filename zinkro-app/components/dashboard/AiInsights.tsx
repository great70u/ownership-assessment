'use client'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Bot, Zap, TrendingDown, AlertTriangle, ArrowRight } from 'lucide-react'

const INSIGHTS = [
  {
    icon: TrendingDown,
    color: '#FFB84D',
    bg: '#FFB84D20',
    text: 'Your transport spending is up 12% vs last month. Consider carpooling twice a week.',
  },
  {
    icon: AlertTriangle,
    color: '#FF6B6B',
    bg: '#FF6B6B20',
    text: 'Gifts budget is 149% used — ₦11,150 over. Review discretionary purchases.',
  },
  {
    icon: Zap,
    color: '#34D399',
    bg: '#34D39920',
    text: 'Great job! You saved ₦71,500 this month — on track for your Lagos Trip goal.',
  },
]

export function AiInsights() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-accent" />
          <CardTitle>AI Insights</CardTitle>
        </div>
        <Link
          href="/dashboard/ai"
          className="text-xs text-accent hover:text-accent/80 flex items-center gap-1"
        >
          Ask AI <ArrowRight className="w-3 h-3" />
        </Link>
      </CardHeader>
      <CardContent className="pt-2 space-y-2.5">
        {INSIGHTS.map((insight, i) => (
          <div key={i} className="flex gap-3 p-3 bg-surface2 rounded-md">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
              style={{ backgroundColor: insight.bg }}
            >
              <insight.icon className="w-3.5 h-3.5" style={{ color: insight.color }} />
            </div>
            <p className="text-xs text-secondary leading-relaxed">{insight.text}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
