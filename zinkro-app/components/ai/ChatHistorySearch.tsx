'use client'
import { Bot, User, Search } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useChatStore } from '@/store/chatStore'

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function ChatHistorySearch() {
  const history = useChatStore(s => s.history)
  const searchQuery = useChatStore(s => s.searchQuery)
  const setSearchQuery = useChatStore(s => s.setSearchQuery)

  const q = searchQuery.trim().toLowerCase()

  const results = q
    ? history.filter(m => m.content.toLowerCase().includes(q))
    : history.slice(-4)

  return (
    <Card>
      <CardContent className="pt-4">
        <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-3">
          Chat History
        </p>

        {/* Search input */}
        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="w-full pl-8 pr-3 py-2 bg-surface2 border border-border rounded-md text-xs text-primary placeholder:text-secondary focus:outline-none focus:border-accent/50 transition-colors"
          />
        </div>

        {/* Results */}
        {history.length === 0 ? (
          <p className="text-xs text-secondary text-center py-3">No history yet</p>
        ) : results.length === 0 ? (
          <p className="text-xs text-secondary text-center py-3">No matches found</p>
        ) : (
          <div className="space-y-1.5">
            {!q && (
              <p className="text-[10px] text-secondary mb-1.5">Recent messages</p>
            )}
            {results.map(msg => (
              <div
                key={msg.id}
                className="flex gap-2 px-2 py-1.5 rounded-md hover:bg-surface2 transition-colors"
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    msg.role === 'assistant' ? 'gradient-bg' : 'bg-surface2 border border-border'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <Bot className="w-2.5 h-2.5 text-white" />
                  ) : (
                    <User className="w-2.5 h-2.5 text-secondary" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-primary truncate leading-tight">
                    {msg.content.slice(0, 80)}{msg.content.length > 80 ? '…' : ''}
                  </p>
                  <p className="text-[10px] text-secondary mt-0.5">{timeAgo(msg.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
