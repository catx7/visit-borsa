-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('PROPERTY', 'SERVICE', 'RESTAURANT');

-- CreateEnum
CREATE TYPE "ContactType" AS ENUM ('PHONE', 'EMAIL', 'WEBSITE');

-- CreateTable
CREATE TABLE "ContactClick" (
    "id" TEXT NOT NULL,
    "entityType" "EntityType" NOT NULL,
    "entityId" TEXT NOT NULL,
    "contactType" "ContactType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactClick_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContactClick_entityType_entityId_idx" ON "ContactClick"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "ContactClick_createdAt_idx" ON "ContactClick"("createdAt");
