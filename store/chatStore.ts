'use client'
import { create } from 'zustand'

export interface ChatMsg {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

interface ChatState {
  history: ChatMsg[]
  searchQuery: string
  historyLoaded: boolean
  setSearchQuery: (q: string) => void
  loadHistory: () => Promise<void>
  saveMessages: (msgs: { role: string; content: string }[]) => Promise<void>
  appendToHistory: (msgs: ChatMsg[]) => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  history: [],
  searchQuery: '',
  historyLoaded: false,

  setSearchQuery: (q) => set({ searchQuery: q }),

  loadHistory: async () => {
    if (get().historyLoaded) return
    try {
      const res = await fetch('/api/ai/messages')
      if (!res.ok) throw new Error(`Failed to load history (${res.status})`)
      const data = await res.json() as { messages: ChatMsg[] }
      set({ history: data.messages, historyLoaded: true })
    } catch (err) {
      console.error('Chat history load failed:', err)
      set({ historyLoaded: true })
    }
  },

  saveMessages: async (msgs) => {
    try {
      await fetch('/api/ai/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: msgs }),
      })
    } catch (err) {
      console.error('Chat save failed:', err)
    }
  },

  appendToHistory: (msgs) => {
    set(s => ({ history: [...s.history, ...msgs] }))
  },
}))
