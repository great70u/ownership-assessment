'use client'
import { useFilterStore } from '@/store/filterStore'
import { useAccounts } from '@/lib/demo-store'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function AccountFilter() {
  const { selectedAccountId, setAccount } = useFilterStore()
  const [open, setOpen] = useState(false)
  const accounts = useAccounts()

  const selectedAccount = accounts.find(a => a.id === selectedAccountId)
  const label = selectedAccountId === 'all' ? 'All Accounts' : selectedAccount?.bankName ?? 'All Accounts'

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 bg-surface2 border border-border rounded-md text-sm text-primary hover:border-accent/50 transition-colors"
      >
        {selectedAccountId !== 'all' && selectedAccount && (
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: selectedAccount.color }}
          />
        )}
        {label}
        <ChevronDown className={cn('w-3.5 h-3.5 text-secondary transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1 left-0 z-20 bg-surface border border-border rounded-lg shadow-xl min-w-[180px] overflow-hidden">
            <button
              onClick={() => { setAccount('all'); setOpen(false) }}
              className={cn(
                'w-full text-left px-4 py-2.5 text-sm hover:bg-surface2 transition-colors flex items-center gap-2',
                selectedAccountId === 'all' ? 'text-accent' : 'text-primary'
              )}
            >
              All Accounts
            </button>
            {accounts.map(acc => (
              <button
                key={acc.id}
                onClick={() => { setAccount(acc.id); setOpen(false) }}
                className={cn(
                  'w-full text-left px-4 py-2.5 text-sm hover:bg-surface2 transition-colors flex items-center gap-2',
                  selectedAccountId === acc.id ? 'text-accent' : 'text-primary'
                )}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: acc.color }} />
                {acc.bankName}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
