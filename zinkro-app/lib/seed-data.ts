// Tomi Bello demo user seed data
// Used both by prisma/seed.ts and by in-memory demo mode

export const DEMO_USER = {
  id: 'demo-user-tomi',
  email: 'tomi@zinkro.demo',
  name: 'Tomi Bello',
  avatarUrl: null,
  healthScore: 78,
  referralCode: 'TOMI2026',
}

export const DEMO_ACCOUNTS = [
  {
    id: 'acc-gtbank',
    userId: 'demo-user-tomi',
    bankName: 'GTBank',
    accountNumber: '0123456789',
    accountType: 'Savings',
    balance: 312800,
    currency: 'NGN',
    color: '#FF6B00',
    isPrimary: true,
  },
  {
    id: 'acc-access',
    userId: 'demo-user-tomi',
    bankName: 'Access Bank',
    accountNumber: '9876543210',
    accountType: 'Current',
    balance: 145500,
    currency: 'NGN',
    color: '#E30613',
    isPrimary: false,
  },
  {
    id: 'acc-zenith',
    userId: 'demo-user-tomi',
    bankName: 'Zenith Bank',
    accountNumber: '4567890123',
    accountType: 'Savings',
    balance: 24000,
    currency: 'NGN',
    color: '#862633',
    isPrimary: false,
  },
]

// 6 months of transactions Jan-Jun 2026
export const DEMO_TRANSACTIONS = [
  // June 2026 - recent
  { id: 't1', userId: 'demo-user-tomi', accountId: 'acc-gtbank', name: 'June Salary', meta: 'NURTW LTD', amount: 450000, type: 'CREDIT' as const, category: 'INCOME' as const, date: '2026-06-01', isRecurring: true, isAutoCategorized: true },
  { id: 't2', userId: 'demo-user-tomi', accountId: 'acc-gtbank', name: 'Shoprite', meta: 'Food & Groceries', amount: 32500, type: 'DEBIT' as const, category: 'FEEDING' as const, date: '2026-06-03', isRecurring: false, isAutoCategorized: true },
  { id: 't3', userId: 'demo-user-tomi', accountId: 'acc-gtbank', name: 'Uber', meta: 'Ride hailing', amount: 4200, type: 'DEBIT' as const, category: 'TRANSPORT' as const, date: '2026-06-04', isRecurring: false, isAutoCategorized: true },
  { id: 't4', userId: 'demo-user-tomi', accountId: 'acc-access', name: 'EKEDC', meta: 'Electricity prepaid', amount: 15000, type: 'DEBIT' as const, category: 'UTILITIES' as const, date: '2026-06-05', isRecurring: true, isAutoCategorized: true },
  { id: 't5', userId: 'demo-user-tomi', accountId: 'acc-gtbank', name: 'Bolt', meta: 'Ride hailing', amount: 3100, type: 'DEBIT' as const, category: 'TRANSPORT' as const, date: '2026-06-07', isRecurring: false, isAutoCategorized: true },
  { id: 't6', userId: 'demo-user-tomi', accountId: 'acc-gtbank', name: 'Konga', meta: 'Online shopping', amount: 18750, type: 'DEBIT' as const, category: 'GIFTS' as const, date: '2026-06-08', isRecurring: false, isAutoCategorized: true },
  { id: 't7', userId: 'demo-user-tomi', accountId: 'acc-gtbank', name: 'ChowDeck', meta: 'Food delivery', amount: 8900, type: 'DEBIT' as const, category: 'FEEDING' as const, date: '2026-06-10', isRecurring: false, isAutoCategorized: true },
  { id: 't8', userId: 'demo-user-tomi', accountId: 'acc-gtbank', name: 'Rent Payment', meta: 'Mr Adeola', amount: 120000, type: 'DEBIT' as const, category: 'RENT' as const, date: '2026-06-11', isRecurring: true, isAutoCategorized: true },
  { id: 't9', userId: 'demo-user-tomi', accountId: 'acc-access', name: 'DStv Subscription', meta: 'DStv Compact Plus', amount: 9900, type: 'DEBIT' as const, category: 'UTILITIES' as const, date: '2026-06-12', isRecurring: true, isAutoCategorized: true },
  { id: 't10', userId: 'demo-user-tomi', accountId: 'acc-gtbank', name: 'Mama Cass', meta: 'Restaurant', amount: 5600, type: 'DEBIT' as const, category: 'FEEDING' as const, date: '2026-06-13', isRecurring: false, isAutoCategorized: true },
  { id: 't11', userId: 'demo-user-tomi', accountId: 'acc-gtbank', name: 'Total Filling Station', meta: 'Fuel', amount: 28000, type: 'DEBIT' as const, category: 'TRANSPORT' as const, date: '2026-06-14', isRecurring: false, isAutoCategorized: true },
  { id: 't12', userId: 'demo-user-tomi', accountId: 'acc-access', name: 'Freelance Design', meta: 'Femi Designs', amount: 75000, type: 'CREDIT' as const, category: 'INCOME' as const, date: '2026-06-15', isRecurring: false, isAutoCategorized: true },
  { id: 't13', userId: 'demo-user-tomi', accountId: 'acc-gtbank', name: 'Netflix', meta: 'Streaming subscription', amount: 4600, type: 'DEBIT' as const, category: 'UTILITIES' as const, date: '2026-06-16', isRecurring: true, isAutoCategorized: true },
  { id: 't14', userId: 'demo-user-tomi', accountId: 'acc-gtbank', name: 'Jumia', meta: 'Online shopping', amount: 22400, type: 'DEBIT' as const, category: 'GIFTS' as const, date: '2026-06-17', isRecurring: false, isAutoCategorized: true },
  { id: 't15', userId: 'demo-user-tomi', accountId: 'acc-gtbank', name: 'Lagos State Waterboard', meta: 'Water bill', amount: 7500, type: 'DEBIT' as const, category: 'UTILITIES' as const, date: '2026-06-18', isRecurring: true, isAutoCategorized: true },
  { id: 't16', userId: 'demo-user-tomi', accountId: 'acc-gtbank', name: 'Uber Eats', meta: 'Food delivery', amount: 6200, type: 'DEBIT' as const, category: 'FEEDING' as const, date: '2026-06-19', isRecurring: false, isAutoCategorized: true },
  { id: 't17', userId: 'demo-user-tomi', accountId: 'acc-access', name: 'MTN Airtime', meta: 'Airtime top-up', amount: 5000, type: 'DEBIT' as const, category: 'UTILITIES' as const, date: '2026-06-20', isRecurring: false, isAutoCategorized: true },
  { id: 't18', userId: 'demo-user-tomi', accountId: 'acc-gtbank', name: 'Transfer to Zenith', meta: 'Personal transfer', amount: 30000, type: 'DEBIT' as const, category: 'OTHER' as const, date: '2026-06-20', isRecurring: false, isAutoCategorized: false },
  { id: 't19', userId: 'demo-user-tomi', accountId: 'acc-zenith', name: 'Transfer from GTBank', meta: 'Personal transfer', amount: 30000, type: 'CREDIT' as const, category: 'INCOME' as const, date: '2026-06-20', isRecurring: false, isAutoCategorized: false },
  { id: 't20', userId: 'demo-user-tomi', accountId: 'acc-gtbank', name: 'Cold Stone', meta: 'Ice cream & desserts', amount: 8500, type: 'DEBIT' as const, category: 'FEEDING' as const, date: '2026-06-21', isRecurring: false, isAutoCategorized: true },

  // May 2026
  { id: 't21', userId: 'demo-user-tomi', accountId: 'acc-gtbank', name: 'May Salary', meta: 'NURTW LTD', amount: 450000, type: 'CREDIT' as const, category: 'INCOME' as const, date: '2026-05-01', isRecurring: true, isAutoCategorized: true },
  { id: 't22', userId: 'demo-user-tomi', accountId: 'acc-gtbank', name: 'Shoprite', meta: 'Food & Groceries', amount: 29800, type: 'DEBIT' as const, category: 'FEEDING' as const, date: '2026-05-04', isRecurring: false, isAutoCategorized: true },
  { id: 't23', userId: 'demo-user-tomi', accountId: 'acc-gtbank', name: 'Rent Payment', meta: 'Mr Adeola', amount: 120000, type: 'DEBIT' as const, category: 'RENT' as const, date: '2026-05-11', isRecurring: true, isAutoCategorized: true },
  { id: 't24', userId: 'demo-user-tomi', accountId: 'acc-access', name: 'EKEDC', meta: 'Electricity prepaid', amount: 15000, type: 'DEBIT' as const, category: 'UTILITIES' as const, date: '2026-05-05', isRecurring: true, isAutoCategorized: true },
  { id: 't25', userId: 'demo-user-tomi', accountId: 'acc-gtbank', name: 'Uber + Bolt', meta: 'Transport', amount: 12400, type: 'DEBIT' as const, category: 'TRANSPORT' as const, date: '2026-05-08', isRecurring: false, isAutoCategorized: true },
  { id: 't26', userId: 'demo-user-tomi', accountId: 'acc-access', name: 'Gift for Mum', meta: 'Mother Day gift', amount: 35000, type: 'DEBIT' as const, category: 'GIFTS' as const, date: '2026-05-12', isRecurring: false, isAutoCategorized: true },
  { id: 't27', userId: 'demo-user-tomi', accountId: 'acc-gtbank', name: 'ChowDeck + restaurants', meta: 'Eating out', amount: 21000, type: 'DEBIT' as const, category: 'FEEDING' as const, date: '2026-05-18', isRecurring: false, isAutoCategorized: true },
  { id: 't28', userId: 'demo-user-tomi', accountId: 'acc-gtbank', name: 'Fuel', meta: 'Total Filling', amount: 25000, type: 'DEBIT' as const, category: 'TRANSPORT' as const, date: '2026-05-22', isRecurring: false, isAutoCategorized: true },

  // April 2026
  { id: 't29', userId: 'demo-user-tomi', accountId: 'acc-gtbank', name: 'April Salary', meta: 'NURTW LTD', amount: 450000, type: 'CREDIT' as const, category: 'INCOME' as const, date: '2026-04-01', isRecurring: true, isAutoCategorized: true },
  { id: 't30', userId: 'demo-user-tomi', accountId: 'acc-gtbank', name: 'Rent Payment', meta: 'Mr Adeola', amount: 120000, type: 'DEBIT' as const, category: 'RENT' as const, date: '2026-04-11', isRecurring: true, isAutoCategorized: true },
  { id: 't31', userId: 'demo-user-tomi', accountId: 'acc-gtbank', name: 'Groceries & Food', meta: 'Shoprite + restaurants', amount: 45000, type: 'DEBIT' as const, category: 'FEEDING' as const, date: '2026-04-15', isRecurring: false, isAutoCategorized: true },
  { id: 't32', userId: 'demo-user-tomi', accountId: 'acc-access', name: 'Utilities', meta: 'EKEDC + DStv + Netflix', amount: 29500, type: 'DEBIT' as const, category: 'UTILITIES' as const, date: '2026-04-06', isRecurring: true, isAutoCategorized: true },
  { id: 't33', userId: 'demo-user-tomi', accountId: 'acc-gtbank', name: 'Transport', meta: 'Uber + Bolt + Fuel', amount: 38000, type: 'DEBIT' as const, category: 'TRANSPORT' as const, date: '2026-04-20', isRecurring: false, isAutoCategorized: true },

  // March 2026
  { id: 't34', userId: 'demo-user-tomi', accountId: 'acc-gtbank', name: 'March Salary', meta: 'NURTW LTD', amount: 450000, type: 'CREDIT' as const, category: 'INCOME' as const, date: '2026-03-01', isRecurring: true, isAutoCategorized: true },
  { id: 't35', userId: 'demo-user-tomi', accountId: 'acc-gtbank', name: 'Rent Payment', meta: 'Mr Adeola', amount: 120000, type: 'DEBIT' as const, category: 'RENT' as const, date: '2026-03-11', isRecurring: true, isAutoCategorized: true },
  { id: 't36', userId: 'demo-user-tomi', accountId: 'acc-gtbank', name: 'Food & Groceries', meta: 'Monthly food', amount: 38000, type: 'DEBIT' as const, category: 'FEEDING' as const, date: '2026-03-14', isRecurring: false, isAutoCategorized: true },
  { id: 't37', userId: 'demo-user-tomi', accountId: 'acc-access', name: 'Utilities', meta: 'Bills', amount: 29500, type: 'DEBIT' as const, category: 'UTILITIES' as const, date: '2026-03-06', isRecurring: true, isAutoCategorized: true },
  { id: 't38', userId: 'demo-user-tomi', accountId: 'acc-gtbank', name: 'Transport', meta: 'Rides + fuel', amount: 31000, type: 'DEBIT' as const, category: 'TRANSPORT' as const, date: '2026-03-20', isRecurring: false, isAutoCategorized: true },
  { id: 't39', userId: 'demo-user-tomi', accountId: 'acc-access', name: 'Freelance Income', meta: 'Design project', amount: 50000, type: 'CREDIT' as const, category: 'INCOME' as const, date: '2026-03-25', isRecurring: false, isAutoCategorized: true },

  // February 2026
  { id: 't40', userId: 'demo-user-tomi', accountId: 'acc-gtbank', name: 'Feb Salary', meta: 'NURTW LTD', amount: 450000, type: 'CREDIT' as const, category: 'INCOME' as const, date: '2026-02-01', isRecurring: true, isAutoCategorized: true },
  { id: 't41', userId: 'demo-user-tomi', accountId: 'acc-gtbank', name: 'Rent Payment', meta: 'Mr Adeola', amount: 120000, type: 'DEBIT' as const, category: 'RENT' as const, date: '2026-02-11', isRecurring: true, isAutoCategorized: true },
  { id: 't42', userId: 'demo-user-tomi', accountId: 'acc-gtbank', name: 'Valentine gifts', meta: 'Shopping', amount: 45000, type: 'DEBIT' as const, category: 'GIFTS' as const, date: '2026-02-14', isRecurring: false, isAutoCategorized: true },
  { id: 't43', userId: 'demo-user-tomi', accountId: 'acc-gtbank', name: 'Food & Groceries', meta: 'Monthly food', amount: 42000, type: 'DEBIT' as const, category: 'FEEDING' as const, date: '2026-02-16', isRecurring: false, isAutoCategorized: true },
  { id: 't44', userId: 'demo-user-tomi', accountId: 'acc-access', name: 'Utilities', meta: 'Bills', amount: 29500, type: 'DEBIT' as const, category: 'UTILITIES' as const, date: '2026-02-06', isRecurring: true, isAutoCategorized: true },
  { id: 't45', userId: 'demo-user-tomi', accountId: 'acc-gtbank', name: 'Transport', meta: 'Rides + fuel', amount: 29000, type: 'DEBIT' as const, category: 'TRANSPORT' as const, date: '2026-02-20', isRecurring: false, isAutoCategorized: true },

  // January 2026
  { id: 't46', userId: 'demo-user-tomi', accountId: 'acc-gtbank', name: 'Jan Salary', meta: 'NURTW LTD', amount: 450000, type: 'CREDIT' as const, category: 'INCOME' as const, date: '2026-01-01', isRecurring: true, isAutoCategorized: true },
  { id: 't47', userId: 'demo-user-tomi', accountId: 'acc-gtbank', name: 'Rent Payment', meta: 'Mr Adeola', amount: 120000, type: 'DEBIT' as const, category: 'RENT' as const, date: '2026-01-11', isRecurring: true, isAutoCategorized: true },
  { id: 't48', userId: 'demo-user-tomi', accountId: 'acc-gtbank', name: 'New Year Shopping', meta: 'Clothes & items', amount: 62000, type: 'DEBIT' as const, category: 'GIFTS' as const, date: '2026-01-05', isRecurring: false, isAutoCategorized: true },
  { id: 't49', userId: 'demo-user-tomi', accountId: 'acc-gtbank', name: 'Food & Groceries', meta: 'Monthly food', amount: 39000, type: 'DEBIT' as const, category: 'FEEDING' as const, date: '2026-01-15', isRecurring: false, isAutoCategorized: true },
  { id: 't50', userId: 'demo-user-tomi', accountId: 'acc-access', name: 'Utilities', meta: 'Bills', amount: 29500, type: 'DEBIT' as const, category: 'UTILITIES' as const, date: '2026-01-06', isRecurring: true, isAutoCategorized: true },
  { id: 't51', userId: 'demo-user-tomi', accountId: 'acc-gtbank', name: 'Transport', meta: 'Rides + fuel', amount: 33000, type: 'DEBIT' as const, category: 'TRANSPORT' as const, date: '2026-01-20', isRecurring: false, isAutoCategorized: true },
]

export const DEMO_BUDGETS = [
  { id: 'b1', userId: 'demo-user-tomi', category: 'FEEDING' as const, amount: 50000, period: 'MONTHLY' as const, month: 6, year: 2026 },
  { id: 'b2', userId: 'demo-user-tomi', category: 'TRANSPORT' as const, amount: 40000, period: 'MONTHLY' as const, month: 6, year: 2026 },
  { id: 'b3', userId: 'demo-user-tomi', category: 'UTILITIES' as const, amount: 35000, period: 'MONTHLY' as const, month: 6, year: 2026 },
  { id: 'b4', userId: 'demo-user-tomi', category: 'GIFTS' as const, amount: 30000, period: 'MONTHLY' as const, month: 6, year: 2026 },
  { id: 'b5', userId: 'demo-user-tomi', category: 'RENT' as const, amount: 120000, period: 'MONTHLY' as const, month: 6, year: 2026 },
  { id: 'b6', userId: 'demo-user-tomi', category: 'OTHER' as const, amount: 20000, period: 'MONTHLY' as const, month: 6, year: 2026 },
]

export const DEMO_GOALS = [
  {
    id: 'g1',
    userId: 'demo-user-tomi',
    name: 'Lagos Trip',
    emoji: '✈️',
    targetAmount: 200000,
    currentAmount: 126000,
    targetDate: '2026-12-25',
    isAutoSave: true,
    autoSaveAmount: 15000,
  },
  {
    id: 'g2',
    userId: 'demo-user-tomi',
    name: 'Emergency Fund',
    emoji: '🛡️',
    targetAmount: 500000,
    currentAmount: 85000,
    targetDate: '2027-06-01',
    isAutoSave: true,
    autoSaveAmount: 25000,
  },
  {
    id: 'g3',
    userId: 'demo-user-tomi',
    name: 'New Laptop',
    emoji: '💻',
    targetAmount: 350000,
    currentAmount: 50000,
    targetDate: '2026-09-01',
    isAutoSave: false,
    autoSaveAmount: 0,
  },
]

export const DEMO_SAVINGS_RULES = [
  {
    id: 'sr1',
    userId: 'demo-user-tomi',
    type: 'AUTO_SAVE' as const,
    name: 'Monthly Auto-Save',
    amount: 25000,
    frequency: 'monthly',
    goalId: 'g1',
    isActive: true,
  },
  {
    id: 'sr2',
    userId: 'demo-user-tomi',
    type: 'ROUND_UP' as const,
    name: 'Round-Up Savings',
    amount: 0,
    frequency: 'per-transaction',
    goalId: 'g2',
    isActive: true,
  },
]

export const DEMO_AI_MESSAGES = [
  {
    id: 'ai1',
    userId: 'demo-user-tomi',
    role: 'ASSISTANT' as const,
    content: JSON.stringify({
      type: 'weekly_review',
      week: 'Jun 14–20',
      totalSpent: 95900,
      vsLastWeek: +12.4,
      categories: [
        { name: 'Feeding', thisWeek: 22100, lastWeek: 18500, color: '#FFB84D' },
        { name: 'Utilities', thisWeek: 32000, lastWeek: 28900, color: '#3D7FFF' },
        { name: 'Transport', thisWeek: 28000, lastWeek: 22300, color: '#00D4D4' },
        { name: 'Gifts', thisWeek: 13800, lastWeek: 8000, color: '#FF6B6B' },
      ],
      insight: "You spent 12% more than last week, mostly on transport. Your fuel spend jumped ₦28k — consider carpooling or public transport twice a week to save up to ₦8k monthly.",
    }),
    createdAt: '2026-06-21T08:00:00Z',
  },
  {
    id: 'ai2',
    userId: 'demo-user-tomi',
    role: 'ASSISTANT' as const,
    content: JSON.stringify({
      type: 'anomaly',
      transaction: { name: 'Jumia', amount: 22400, date: 'Jun 17' },
      message: "Heads up — you spent ₦22,400 on Jumia on Jun 17. This is 3× your usual online shopping amount. Did you mean to spend this much?",
    }),
    createdAt: '2026-06-17T14:30:00Z',
  },
]
