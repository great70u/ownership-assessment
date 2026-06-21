-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEBIT', 'CREDIT');
CREATE TYPE "TransactionCategory" AS ENUM ('FEEDING', 'TRANSPORT', 'UTILITIES', 'GIFTS', 'RENT', 'OTHER', 'INCOME');
CREATE TYPE "BudgetPeriod" AS ENUM ('MONTHLY', 'WEEKLY');
CREATE TYPE "SavingsRuleType" AS ENUM ('ROUND_UP', 'AUTO_SAVE', 'SWEEP');
CREATE TYPE "AiMessageRole" AS ENUM ('USER', 'ASSISTANT');

-- CreateTable
CREATE TABLE "users" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "avatarUrl" TEXT,
  "healthScore" INTEGER NOT NULL DEFAULT 0,
  "referralCode" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "bankName" TEXT NOT NULL,
  "accountNumber" TEXT NOT NULL,
  "accountType" TEXT NOT NULL DEFAULT 'Savings',
  "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "currency" TEXT NOT NULL DEFAULT 'NGN',
  "color" TEXT NOT NULL DEFAULT '#3D7FFF',
  "lastSynced" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "isPrimary" BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "accountId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "meta" TEXT NOT NULL DEFAULT '',
  "amount" DOUBLE PRECISION NOT NULL,
  "type" "TransactionType" NOT NULL,
  "category" "TransactionCategory" NOT NULL DEFAULT 'OTHER',
  "date" TIMESTAMP(3) NOT NULL,
  "isRecurring" BOOLEAN NOT NULL DEFAULT false,
  "isAutoCategorized" BOOLEAN NOT NULL DEFAULT false,
  "rawSmsText" TEXT,
  "note" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budgets" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "category" "TransactionCategory" NOT NULL,
  "amount" DOUBLE PRECISION NOT NULL,
  "period" "BudgetPeriod" NOT NULL DEFAULT 'MONTHLY',
  "month" INTEGER NOT NULL,
  "year" INTEGER NOT NULL,
  CONSTRAINT "budgets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goals" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "emoji" TEXT NOT NULL DEFAULT '🎯',
  "targetAmount" DOUBLE PRECISION NOT NULL,
  "currentAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "targetDate" TIMESTAMP(3) NOT NULL,
  "isAutoSave" BOOLEAN NOT NULL DEFAULT false,
  "autoSaveAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "savings_rules" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" "SavingsRuleType" NOT NULL,
  "name" TEXT NOT NULL,
  "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "frequency" TEXT NOT NULL DEFAULT 'monthly',
  "goalId" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT "savings_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_messages" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "role" "AiMessageRole" NOT NULL,
  "content" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ai_messages_pkey" PRIMARY KEY ("id")
);

-- CreateUniqueIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_referralCode_key" ON "users"("referralCode");
CREATE UNIQUE INDEX "budgets_userId_category_month_year_key" ON "budgets"("userId", "category", "month", "year");

-- CreateIndex
CREATE INDEX "transactions_userId_date_idx" ON "transactions"("userId", "date" DESC);
CREATE INDEX "transactions_accountId_idx" ON "transactions"("accountId");
CREATE INDEX "ai_messages_userId_createdAt_idx" ON "ai_messages"("userId", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "goals" ADD CONSTRAINT "goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "savings_rules" ADD CONSTRAINT "savings_rules_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "savings_rules" ADD CONSTRAINT "savings_rules_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "goals"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ai_messages" ADD CONSTRAINT "ai_messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
