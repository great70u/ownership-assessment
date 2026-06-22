-- Zinkro full setup: creates all tables and loads the Tomi Bello demo data.
-- Paste this entire file into Supabase > SQL Editor > New query > Run.

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


-- ============ SEED DATA ============

INSERT INTO "users" ("id","email","name","avatarUrl","healthScore","referralCode","updatedAt") VALUES ('demo-user-tomi','tomi@zinkro.demo','Tomi Bello',NULL,78,'TOMI2026',now());

INSERT INTO "accounts" ("id","userId","bankName","accountNumber","accountType","balance","currency","color","isPrimary") VALUES ('acc-gtbank','demo-user-tomi','GTBank','0123456789','Savings',312800,'NGN','#FF6B00',true);
INSERT INTO "accounts" ("id","userId","bankName","accountNumber","accountType","balance","currency","color","isPrimary") VALUES ('acc-access','demo-user-tomi','Access Bank','9876543210','Current',145500,'NGN','#E30613',false);
INSERT INTO "accounts" ("id","userId","bankName","accountNumber","accountType","balance","currency","color","isPrimary") VALUES ('acc-zenith','demo-user-tomi','Zenith Bank','4567890123','Savings',24000,'NGN','#862633',false);

INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t1','demo-user-tomi','acc-gtbank','June Salary','NURTW LTD',450000,'CREDIT'::"TransactionType",'INCOME'::"TransactionCategory",'2026-06-01'::timestamp,true,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t2','demo-user-tomi','acc-gtbank','Shoprite','Food & Groceries',32500,'DEBIT'::"TransactionType",'FEEDING'::"TransactionCategory",'2026-06-03'::timestamp,false,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t3','demo-user-tomi','acc-gtbank','Uber','Ride hailing',4200,'DEBIT'::"TransactionType",'TRANSPORT'::"TransactionCategory",'2026-06-04'::timestamp,false,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t4','demo-user-tomi','acc-access','EKEDC','Electricity prepaid',15000,'DEBIT'::"TransactionType",'UTILITIES'::"TransactionCategory",'2026-06-05'::timestamp,true,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t5','demo-user-tomi','acc-gtbank','Bolt','Ride hailing',3100,'DEBIT'::"TransactionType",'TRANSPORT'::"TransactionCategory",'2026-06-07'::timestamp,false,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t6','demo-user-tomi','acc-gtbank','Konga','Online shopping',18750,'DEBIT'::"TransactionType",'GIFTS'::"TransactionCategory",'2026-06-08'::timestamp,false,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t7','demo-user-tomi','acc-gtbank','ChowDeck','Food delivery',8900,'DEBIT'::"TransactionType",'FEEDING'::"TransactionCategory",'2026-06-10'::timestamp,false,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t8','demo-user-tomi','acc-gtbank','Rent Payment','Mr Adeola',120000,'DEBIT'::"TransactionType",'RENT'::"TransactionCategory",'2026-06-11'::timestamp,true,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t9','demo-user-tomi','acc-access','DStv Subscription','DStv Compact Plus',9900,'DEBIT'::"TransactionType",'UTILITIES'::"TransactionCategory",'2026-06-12'::timestamp,true,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t10','demo-user-tomi','acc-gtbank','Mama Cass','Restaurant',5600,'DEBIT'::"TransactionType",'FEEDING'::"TransactionCategory",'2026-06-13'::timestamp,false,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t11','demo-user-tomi','acc-gtbank','Total Filling Station','Fuel',28000,'DEBIT'::"TransactionType",'TRANSPORT'::"TransactionCategory",'2026-06-14'::timestamp,false,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t12','demo-user-tomi','acc-access','Freelance Design','Femi Designs',75000,'CREDIT'::"TransactionType",'INCOME'::"TransactionCategory",'2026-06-15'::timestamp,false,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t13','demo-user-tomi','acc-gtbank','Netflix','Streaming subscription',4600,'DEBIT'::"TransactionType",'UTILITIES'::"TransactionCategory",'2026-06-16'::timestamp,true,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t14','demo-user-tomi','acc-gtbank','Jumia','Online shopping',22400,'DEBIT'::"TransactionType",'GIFTS'::"TransactionCategory",'2026-06-17'::timestamp,false,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t15','demo-user-tomi','acc-gtbank','Lagos State Waterboard','Water bill',7500,'DEBIT'::"TransactionType",'UTILITIES'::"TransactionCategory",'2026-06-18'::timestamp,true,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t16','demo-user-tomi','acc-gtbank','Uber Eats','Food delivery',6200,'DEBIT'::"TransactionType",'FEEDING'::"TransactionCategory",'2026-06-19'::timestamp,false,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t17','demo-user-tomi','acc-access','MTN Airtime','Airtime top-up',5000,'DEBIT'::"TransactionType",'UTILITIES'::"TransactionCategory",'2026-06-20'::timestamp,false,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t18','demo-user-tomi','acc-gtbank','Transfer to Zenith','Personal transfer',30000,'DEBIT'::"TransactionType",'OTHER'::"TransactionCategory",'2026-06-20'::timestamp,false,false);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t19','demo-user-tomi','acc-zenith','Transfer from GTBank','Personal transfer',30000,'CREDIT'::"TransactionType",'INCOME'::"TransactionCategory",'2026-06-20'::timestamp,false,false);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t20','demo-user-tomi','acc-gtbank','Cold Stone','Ice cream & desserts',8500,'DEBIT'::"TransactionType",'FEEDING'::"TransactionCategory",'2026-06-21'::timestamp,false,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t21','demo-user-tomi','acc-gtbank','May Salary','NURTW LTD',450000,'CREDIT'::"TransactionType",'INCOME'::"TransactionCategory",'2026-05-01'::timestamp,true,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t22','demo-user-tomi','acc-gtbank','Shoprite','Food & Groceries',29800,'DEBIT'::"TransactionType",'FEEDING'::"TransactionCategory",'2026-05-04'::timestamp,false,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t23','demo-user-tomi','acc-gtbank','Rent Payment','Mr Adeola',120000,'DEBIT'::"TransactionType",'RENT'::"TransactionCategory",'2026-05-11'::timestamp,true,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t24','demo-user-tomi','acc-access','EKEDC','Electricity prepaid',15000,'DEBIT'::"TransactionType",'UTILITIES'::"TransactionCategory",'2026-05-05'::timestamp,true,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t25','demo-user-tomi','acc-gtbank','Uber + Bolt','Transport',12400,'DEBIT'::"TransactionType",'TRANSPORT'::"TransactionCategory",'2026-05-08'::timestamp,false,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t26','demo-user-tomi','acc-access','Gift for Mum','Mother Day gift',35000,'DEBIT'::"TransactionType",'GIFTS'::"TransactionCategory",'2026-05-12'::timestamp,false,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t27','demo-user-tomi','acc-gtbank','ChowDeck + restaurants','Eating out',21000,'DEBIT'::"TransactionType",'FEEDING'::"TransactionCategory",'2026-05-18'::timestamp,false,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t28','demo-user-tomi','acc-gtbank','Fuel','Total Filling',25000,'DEBIT'::"TransactionType",'TRANSPORT'::"TransactionCategory",'2026-05-22'::timestamp,false,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t29','demo-user-tomi','acc-gtbank','April Salary','NURTW LTD',450000,'CREDIT'::"TransactionType",'INCOME'::"TransactionCategory",'2026-04-01'::timestamp,true,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t30','demo-user-tomi','acc-gtbank','Rent Payment','Mr Adeola',120000,'DEBIT'::"TransactionType",'RENT'::"TransactionCategory",'2026-04-11'::timestamp,true,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t31','demo-user-tomi','acc-gtbank','Groceries & Food','Shoprite + restaurants',45000,'DEBIT'::"TransactionType",'FEEDING'::"TransactionCategory",'2026-04-15'::timestamp,false,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t32','demo-user-tomi','acc-access','Utilities','EKEDC + DStv + Netflix',29500,'DEBIT'::"TransactionType",'UTILITIES'::"TransactionCategory",'2026-04-06'::timestamp,true,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t33','demo-user-tomi','acc-gtbank','Transport','Uber + Bolt + Fuel',38000,'DEBIT'::"TransactionType",'TRANSPORT'::"TransactionCategory",'2026-04-20'::timestamp,false,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t34','demo-user-tomi','acc-gtbank','March Salary','NURTW LTD',450000,'CREDIT'::"TransactionType",'INCOME'::"TransactionCategory",'2026-03-01'::timestamp,true,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t35','demo-user-tomi','acc-gtbank','Rent Payment','Mr Adeola',120000,'DEBIT'::"TransactionType",'RENT'::"TransactionCategory",'2026-03-11'::timestamp,true,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t36','demo-user-tomi','acc-gtbank','Food & Groceries','Monthly food',38000,'DEBIT'::"TransactionType",'FEEDING'::"TransactionCategory",'2026-03-14'::timestamp,false,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t37','demo-user-tomi','acc-access','Utilities','Bills',29500,'DEBIT'::"TransactionType",'UTILITIES'::"TransactionCategory",'2026-03-06'::timestamp,true,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t38','demo-user-tomi','acc-gtbank','Transport','Rides + fuel',31000,'DEBIT'::"TransactionType",'TRANSPORT'::"TransactionCategory",'2026-03-20'::timestamp,false,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t39','demo-user-tomi','acc-access','Freelance Income','Design project',50000,'CREDIT'::"TransactionType",'INCOME'::"TransactionCategory",'2026-03-25'::timestamp,false,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t40','demo-user-tomi','acc-gtbank','Feb Salary','NURTW LTD',450000,'CREDIT'::"TransactionType",'INCOME'::"TransactionCategory",'2026-02-01'::timestamp,true,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t41','demo-user-tomi','acc-gtbank','Rent Payment','Mr Adeola',120000,'DEBIT'::"TransactionType",'RENT'::"TransactionCategory",'2026-02-11'::timestamp,true,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t42','demo-user-tomi','acc-gtbank','Valentine gifts','Shopping',45000,'DEBIT'::"TransactionType",'GIFTS'::"TransactionCategory",'2026-02-14'::timestamp,false,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t43','demo-user-tomi','acc-gtbank','Food & Groceries','Monthly food',42000,'DEBIT'::"TransactionType",'FEEDING'::"TransactionCategory",'2026-02-16'::timestamp,false,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t44','demo-user-tomi','acc-access','Utilities','Bills',29500,'DEBIT'::"TransactionType",'UTILITIES'::"TransactionCategory",'2026-02-06'::timestamp,true,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t45','demo-user-tomi','acc-gtbank','Transport','Rides + fuel',29000,'DEBIT'::"TransactionType",'TRANSPORT'::"TransactionCategory",'2026-02-20'::timestamp,false,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t46','demo-user-tomi','acc-gtbank','Jan Salary','NURTW LTD',450000,'CREDIT'::"TransactionType",'INCOME'::"TransactionCategory",'2026-01-01'::timestamp,true,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t47','demo-user-tomi','acc-gtbank','Rent Payment','Mr Adeola',120000,'DEBIT'::"TransactionType",'RENT'::"TransactionCategory",'2026-01-11'::timestamp,true,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t48','demo-user-tomi','acc-gtbank','New Year Shopping','Clothes & items',62000,'DEBIT'::"TransactionType",'GIFTS'::"TransactionCategory",'2026-01-05'::timestamp,false,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t49','demo-user-tomi','acc-gtbank','Food & Groceries','Monthly food',39000,'DEBIT'::"TransactionType",'FEEDING'::"TransactionCategory",'2026-01-15'::timestamp,false,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t50','demo-user-tomi','acc-access','Utilities','Bills',29500,'DEBIT'::"TransactionType",'UTILITIES'::"TransactionCategory",'2026-01-06'::timestamp,true,true);
INSERT INTO "transactions" ("id","userId","accountId","name","meta","amount","type","category","date","isRecurring","isAutoCategorized") VALUES ('t51','demo-user-tomi','acc-gtbank','Transport','Rides + fuel',33000,'DEBIT'::"TransactionType",'TRANSPORT'::"TransactionCategory",'2026-01-20'::timestamp,false,true);

INSERT INTO "budgets" ("id","userId","category","amount","period","month","year") VALUES ('b1','demo-user-tomi','FEEDING'::"TransactionCategory",50000,'MONTHLY'::"BudgetPeriod",6,2026);
INSERT INTO "budgets" ("id","userId","category","amount","period","month","year") VALUES ('b2','demo-user-tomi','TRANSPORT'::"TransactionCategory",40000,'MONTHLY'::"BudgetPeriod",6,2026);
INSERT INTO "budgets" ("id","userId","category","amount","period","month","year") VALUES ('b3','demo-user-tomi','UTILITIES'::"TransactionCategory",35000,'MONTHLY'::"BudgetPeriod",6,2026);
INSERT INTO "budgets" ("id","userId","category","amount","period","month","year") VALUES ('b4','demo-user-tomi','GIFTS'::"TransactionCategory",30000,'MONTHLY'::"BudgetPeriod",6,2026);
INSERT INTO "budgets" ("id","userId","category","amount","period","month","year") VALUES ('b5','demo-user-tomi','RENT'::"TransactionCategory",120000,'MONTHLY'::"BudgetPeriod",6,2026);
INSERT INTO "budgets" ("id","userId","category","amount","period","month","year") VALUES ('b6','demo-user-tomi','OTHER'::"TransactionCategory",20000,'MONTHLY'::"BudgetPeriod",6,2026);

INSERT INTO "goals" ("id","userId","name","emoji","targetAmount","currentAmount","targetDate","isAutoSave","autoSaveAmount") VALUES ('g1','demo-user-tomi','Lagos Trip','✈️',200000,126000,'2026-12-25'::timestamp,true,15000);
INSERT INTO "goals" ("id","userId","name","emoji","targetAmount","currentAmount","targetDate","isAutoSave","autoSaveAmount") VALUES ('g2','demo-user-tomi','Emergency Fund','🛡️',500000,85000,'2027-06-01'::timestamp,true,25000);
INSERT INTO "goals" ("id","userId","name","emoji","targetAmount","currentAmount","targetDate","isAutoSave","autoSaveAmount") VALUES ('g3','demo-user-tomi','New Laptop','💻',350000,50000,'2026-09-01'::timestamp,false,0);

INSERT INTO "savings_rules" ("id","userId","type","name","amount","frequency","goalId","isActive") VALUES ('sr1','demo-user-tomi','AUTO_SAVE'::"SavingsRuleType",'Monthly Auto-Save',25000,'monthly','g1',true);
INSERT INTO "savings_rules" ("id","userId","type","name","amount","frequency","goalId","isActive") VALUES ('sr2','demo-user-tomi','ROUND_UP'::"SavingsRuleType",'Round-Up Savings',0,'per-transaction','g2',true);
