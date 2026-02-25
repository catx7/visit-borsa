-- CreateEnum
CREATE TYPE "MealPolicy" AS ENUM ('NONE', 'INCLUDED', 'EXTRA_COST');

-- AlterTable
ALTER TABLE "Property"
  ADD COLUMN "mealPolicy" "MealPolicy" NOT NULL DEFAULT 'NONE',
  ADD COLUMN "paymentMethods" TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "depositRequired" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "depositPolicyRo" TEXT,
  ADD COLUMN "depositPolicyEn" TEXT,
  ADD COLUMN "priceWholeUnit" DOUBLE PRECISION,
  ADD COLUMN "paidExtras" TEXT[] DEFAULT ARRAY[]::TEXT[];
