-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "isLocationOfMonth" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "isLocationOfMonth" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "promotionOrder" INTEGER;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "isLocationOfMonth" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "promotionOrder" INTEGER;
