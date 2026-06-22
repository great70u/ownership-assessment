// One-off generator: emits a single SQL file (DDL + seed INSERTs) that can be
// pasted into the Supabase SQL Editor to create and populate all tables.
// Run: npx tsx prisma/generate-setup-sql.ts
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import {
  DEMO_USER,
  DEMO_ACCOUNTS,
  DEMO_TRANSACTIONS,
  DEMO_BUDGETS,
  DEMO_GOALS,
  DEMO_SAVINGS_RULES,
} from '../lib/seed-data'

const q = (v: unknown): string => {
  if (v === null || v === undefined) return 'NULL'
  if (typeof v === 'number') return String(v)
  if (typeof v === 'boolean') return v ? 'true' : 'false'
  return `'${String(v).replace(/'/g, "''")}'`
}

const ddl = readFileSync(join(__dirname, 'migrations/0001_init/migration.sql'), 'utf8')

let sql = `-- Zinkro full setup: creates all tables and loads the Tomi Bello demo data.
-- Paste this entire file into Supabase > SQL Editor > New query > Run.

${ddl}

-- ============ SEED DATA ============

`

sql += `INSERT INTO "users" ("id","email","name","avatarUrl","healthScore","referralCode","updatedAt") VALUES (${q(DEMO_USER.id)},${q(DEMO_USER.email)},${q(DEMO_USER.name)},${q(DEMO_USER.avatarUrl)},${q(DEMO_USER.healthScore)},${q(DEMO_USER.referralCode)},now());\n\n`

for (const a of DEMO_ACCOUNTS) {
  sql += `INSERT INTO "accounts" ("id","userId","bankName","accountNumber","accountType","balance","currency","color","isPrimary") VALUES (${q(a.id)},${q(a.userId)},${q(a.bankName)},${q(a.accountNumber)},${q(a.accountType)},${q(a.balance)},${q(a.currency)},${q(a.color)},${q(a.isPrimary)});\n`
}
sql += '\n'

for (const t of DEMO_TRANSACTIONS) {
  sql += `INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES (${q(t.id)},${q(t.userId)},${q(t.accountId)},${q(t.name)},${q(t.meta)},${q(t.amount)},${q(t.type)}::"TransactionType",${q(t.category)}::"TransactionCategory",${q(t.date)}::timestamp,${q(t.isRecurring)},${q(t.isAutoCategorized)});\n`
}
sql += '\n'

for (const b of DEMO_BUDGETS) {
  sql += `INSERT INTO "budgets" ("id","userId","category","amount","period","month","year") VALUES (${q(b.id)},${q(b.userId)},${q(b.category)}::"TransactionCategory",${q(b.amount)},${q(b.period)}::"BudgetPeriod",${q(b.month)},${q(b.year)});\n`
}
sql += '\n'

for (const g of DEMO_GOALS) {
  sql += `INSERT INTO "goals" ("id","userId","name","emoji","targetAmount","currentAmount","targetDate","isAutoSave","autoSaveAmount") VALUES (${q(g.id)},${q(g.userId)},${q(g.name)},${q(g.emoji)},${q(g.targetAmount)},${q(g.currentAmount)},${q(g.targetDate)}::timestamp,${q(g.isAutoSave)},${q(g.autoSaveAmount)});\n`
}
sql += '\n'

for (const r of DEMO_SAVINGS_RULES) {
  sql += `INSERT INTO "savings_rules" ("id","userId","type","name","amount","frequency","goalId","isActive") VALUES (${q(r.id)},${q(r.userId)},${q(r.type)}::"SavingsRuleType",${q(r.name)},${q(r.amount)},${q(r.frequency)},${q(r.goalId)},${q(r.isActive)});\n`
}

writeFileSync(join(__dirname, 'supabase-setup.sql'), sql)
console.log('Wrote prisma/supabase-setup.sql')
