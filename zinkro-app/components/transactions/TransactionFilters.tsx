'use client'
import { useFilterStore } from '@/store/filterStore'
import { CATEGORY_LABELS } from '@/types'
import { cn } from '@/lib/utils'
import { Search, X } from 'lucide-react'
import type { TransactionCategory } from '@/types'

const CATEGORIES: (TransactionCategory | 'ALL')[] = [
  'ALL', 'FEEDING', 'TRANSPORT', 'UTILITIES', 'GIFTS', 'RENT', 'INCOME', 'OTHER',
]

const CATEGORY_DISPLAY: Record<string, string> = {
  ALL: 'All',
  ...CATEGORY_LABELS,
}

export function TransactionFilters() {
  const { selectedType, setType, selectedCategory, setCategory, searchQuery, setSearch } = useFilterStore()

  return (
    <div className="space-y-3 mb-5">
      {/* Type + search row */}
      <div className="flex items-center gap-3">
        <div className="flex bg-surface border border-border rounded-md p-0.5">
          {(['ALL', 'CREDIT', 'DEBIT'] as const).map(type => (
            <button
              key={type}
              onClick={() => setType(type)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded transition-colors',
                selectedType === type
                  ? 'bg-accent text-white'
                  : 'text-secondary hover:text-primary'
              )}
            >
              {type === 'ALL' ? 'All' : type === 'CREDIT' ? 'Income' : 'Expenses'}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-secondary" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-surface border border-border rounded-md pl-9 pr-4 py-2 text-sm text-primary placeholder:text-secondary focus:outline-none focus:border-accent/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              'px-3 py-1 text-xs font-medium rounded-full border transition-colors',
              selectedCategory === cat
                ? 'bg-accent border-accent text-white'
                : 'border-border text-secondary hover:text-primary hover:border-accent/50'
            )}
          >
            {CATEGORY_DISPLAY[cat]}
          </button>
        ))}
      </div>
    </div>
  )
}
