import { TransactionFilters } from '@/components/transactions/TransactionFilters'
import { TransactionTable } from '@/components/transactions/TransactionTable'
import { AccountFilter } from '@/components/shared/AccountFilter'

export default function TransactionsPage() {
  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary">Transactions</h1>
          <p className="text-secondary text-sm mt-1">All your financial activity in one place</p>
        </div>
        <AccountFilter />
      </div>

      <TransactionFilters />
      <TransactionTable />
    </div>
  )
}
