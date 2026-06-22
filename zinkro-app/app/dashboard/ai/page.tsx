'use client'
import { useRef } from 'react'
import { ChatWindow, ChatWindowHandle } from '@/components/ai/ChatWindow'
import { ChatHistorySearch } from '@/components/ai/ChatHistorySearch'
import { Bot, TrendingUp, AlertCircle, BarChart3 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const QUICK_ACTIONS = [
  { icon: TrendingUp, label: 'Weekly Review', color: '#3D7FFF', prompt: 'Give me a detailed weekly review of my spending compared to last week.' },
  { icon: AlertCircle, label: 'Anomaly Alerts', color: '#FF6B6B', prompt: 'Are there any unusual or suspicious transactions in my accounts recently?' },
  { icon: BarChart3, label: 'Health Score', color: '#34D399', prompt: 'Explain my financial health score of 78 and what specific actions I can take to improve it.' },
]

export default function AiPage() {
  const chatRef = useRef<ChatWindowHandle>(null)

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-primary">Zinkro AI</h1>
          <p className="text-secondary text-sm">Your personal finance coach</p>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_260px] gap-6">
        {/* Chat */}
        <ChatWindow ref={chatRef} />

        {/* Right panel */}
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-4">
              <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-3">Quick Actions</p>
              <div className="space-y-2">
                {QUICK_ACTIONS.map(({ icon: Icon, label, color, prompt }) => (
                  <button
                    key={label}
                    onClick={() => chatRef.current?.submitMessage(prompt)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-surface2 transition-colors text-left"
                  >
                    <div
                      className="w-7 h-7 rounded-md flex items-center justify-center"
                      style={{ backgroundColor: `${color}20` }}
                    >
                      <Icon className="w-3.5 h-3.5" style={{ color }} />
                    </div>
                    <span className="text-sm text-primary">{label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <ChatHistorySearch />
        </div>
      </div>
    </div>
  )
}
