export type TransactionType = 'DEBIT' | 'CREDIT'
export type TransactionCategory =
  | 'FEEDING'
  | 'TRANSPORT'
  | 'UTILITIES'
  | 'GIFTS'
  | 'RENT'
  | 'OTHER'
  | 'INCOME'

export type BudgetPeriod = 'MONTHLY' | 'WEEKLY'
export type SavingsRuleType = 'ROUND_UP' | 'AUTO_SAVE' | 'SWEEP'
export type AiMessageRole = 'USER' | 'ASSISTANT'

export interface Account {
  id: string
  userId: string
  bankName: string
  accountNumber: string
  accountType: string
  balance: number
  currency: string
  color: string
  lastSynced: string
  isPrimary: boolean
}

export interface Transaction {
  id: string
  userId: string
  accountId: string
  account?: Account
  name: string
  meta: string
  amount: number
  type: TransactionType
  category: TransactionCategory
  date: string
  isRecurring: boolean
  isAutoCategorized: boolean
  rawSmsText?: string
  note?: string
}

export interface Budget {
  id: string
  userId: string
  category: TransactionCategory
  amount: number
  period: BudgetPeriod
  month: number
  year: number
  spent?: number
}

export interface Goal {
  id: string
  userId: string
  name: string
  targetAmount: number
  currentAmount: number
  targetDate: string
  isAutoSave: boolean
  autoSaveAmount: number
  emoji?: string
}

export interface SavingsRule {
  id: string
  userId: string
  type: SavingsRuleType
  name: string
  amount: number
  frequency: string
  goalId?: string
  goal?: Goal
  isActive: boolean
}

export interface AiMessage {
  id: string
  userId: string
  role: AiMessageRole
  content: string
  createdAt: string
}

export interface HealthScore {
  score: number
  label: 'Poor' | 'Fair' | 'Good' | 'Excellent'
  color: string
  budgetAdherence: number
  savingsRate: number
  goalProgress: number
  spendingDiversity: number
}

export interface DashboardStats {
  totalBalance: number
  totalSpent: number
  totalSaved: number
  healthScore: HealthScore
  accounts: Account[]
}

export const CATEGORY_COLORS: Record<TransactionCategory, string> = {
  FEEDING: '#FFB84D',
  TRANSPORT: '#00D4D4',
  UTILITIES: '#3D7FFF',
  GIFTS: '#FF6B6B',
  RENT: '#9B7EDE',
  OTHER: '#8A8F98',
  INCOME: '#34D399',
}

export const CATEGORY_LABELS: Record<TransactionCategory, string> = {
  FEEDING: 'Feeding',
  TRANSPORT: 'Transport',
  UTILITIES: 'Utilities',
  GIFTS: 'Gifts',
  RENT: 'Rent',
  OTHER: 'Other',
  INCOME: 'Income',
}

export const CATEGORY_EMOJIS: Record<TransactionCategory, string> = {
  FEEDING: '🍔',
  TRANSPORT: '🚗',
  UTILITIES: '💡',
  GIFTS: '🎁',
  RENT: '🏠',
  OTHER: '📦',
  INCOME: '💰',
}
