'use client'
import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react'
import { Bot, User, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export interface ChatWindowHandle {
  submitMessage: (text: string) => void
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'init',
    role: 'assistant',
    content: "Hi Tomi! 👋 I'm your Zinkro AI assistant. I can see your finances across all 3 accounts. Ask me anything — like \"How did I spend last week?\" or \"Am I on track for my goals?\"",
  },
]

const PROMPT_CHIPS = [
  'How did I spend this month?',
  'Am I on track for my goals?',
  'Where can I cut back?',
  'Give me a weekly review',
  'What\'s my savings rate?',
]

export const ChatWindow = forwardRef<ChatWindowHandle>(function ChatWindow(_, ref) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [apiKeyMissing, setApiKeyMissing] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useImperativeHandle(ref, () => ({
    submitMessage: (text: string) => sendMessage(text),
  }))

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(content: string) {
    if (!content.trim() || streaming) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: content.trim() }
    const assistantId = (Date.now() + 1).toString()
    const assistantMsg: Message = { id: assistantId, role: 'assistant', content: '' }

    setMessages(prev => [...prev, userMsg, assistantMsg])
    setInput('')
    setStreaming(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        if (err.error?.includes('ANTHROPIC_API_KEY')) {
          setApiKeyMissing(true)
          setMessages(prev =>
            prev.map(m =>
              m.id === assistantId
                ? { ...m, content: '⚠️ AI assistant requires an ANTHROPIC_API_KEY to be configured in environment variables. The rest of the app works without it!' }
                : m
            )
          )
          return
        }
        throw new Error(err.error || 'Request failed')
      }

      const reader = res.body?.getReader()
      if (!reader) throw new Error('No response body')

      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        const snapshot = accumulated
        setMessages(prev =>
          prev.map(m => (m.id === assistantId ? { ...m, content: snapshot } : m))
        )
      }
    } catch (err) {
      console.error(err)
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId
            ? { ...m, content: 'Sorry, I encountered an error. Please try again.' }
            : m
        )
      )
    } finally {
      setStreaming(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
          >
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                msg.role === 'assistant' ? 'gradient-bg' : 'bg-surface2 border border-border'
              )}
            >
              {msg.role === 'assistant' ? (
                <Bot className="w-4 h-4 text-white" />
              ) : (
                <User className="w-4 h-4 text-secondary" />
              )}
            </div>
            <div
              className={cn(
                'max-w-[80%] rounded-lg px-4 py-3 text-sm leading-relaxed',
                msg.role === 'assistant'
                  ? 'bg-surface border border-border text-primary'
                  : 'gradient-bg text-white'
              )}
            >
              {msg.content || (
                <span className="flex items-center gap-1.5 text-secondary">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Thinking...
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Prompt chips */}
      {messages.length <= 1 && (
        <div className="flex gap-2 flex-wrap mb-3">
          {PROMPT_CHIPS.map(chip => (
            <button
              key={chip}
              onClick={() => sendMessage(chip)}
              className="px-3 py-1.5 bg-surface border border-border rounded-full text-xs text-secondary hover:text-primary hover:border-accent/50 transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-3 pt-3 border-t border-border">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
          placeholder="Ask anything about your finances..."
          disabled={streaming}
          className="flex-1 bg-surface border border-border rounded-lg px-4 py-3 text-sm text-primary placeholder:text-secondary focus:outline-none focus:border-accent/50 transition-colors disabled:opacity-50"
        />
        <Button
          onClick={() => sendMessage(input)}
          disabled={streaming || !input.trim()}
          variant="gradient"
          size="icon"
          className="shrink-0 w-12 h-12"
        >
          {streaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  )
})
