'use client'
import { useState } from 'react'
import { TransactionFilters } from '@/components/transactions/TransactionFilters'
import { TransactionTable } from '@/components/transactions/TransactionTable'
import { AccountFilter } from '@/components/shared/AccountFilter'
import { AddTransactionModal } from '@/components/transactions/AddTransactionModal'
import { Plus } from 'lucide-react'

export default function TransactionsPage() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary">Transactions</h1>
          <p className="text-secondary text-sm mt-1">All your financial activity in one place</p>
        </div>
        <div className="flex items-center gap-3">
          <AccountFilter />
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 gradient-bg text-white text-sm font-medium rounded-lg hover:opacity-90 transition"
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </button>
        </div>
      </div>

      <TransactionFilters />
      <TransactionTable />

      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
