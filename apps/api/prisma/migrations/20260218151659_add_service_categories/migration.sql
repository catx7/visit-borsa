-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ServiceCategory" ADD VALUE 'TAXI_LOCAL';
ALTER TYPE "ServiceCategory" ADD VALUE 'RENT_A_CAR';
ALTER TYPE "ServiceCategory" ADD VALUE 'FOTOGRAF';
ALTER TYPE "ServiceCategory" ADD VALUE 'INSTALATOR';
ALTER TYPE "ServiceCategory" ADD VALUE 'ELECTRICIAN';
ALTER TYPE "ServiceCategory" ADD VALUE 'TRANSPORT_MARFA';
ALTER TYPE "ServiceCategory" ADD VALUE 'DESZAPEZIRE';
ALTER TYPE "ServiceCategory" ADD VALUE 'MASAJ';
ALTER TYPE "ServiceCategory" ADD VALUE 'INSTRUCTOR_FITNESS';
ALTER TYPE "ServiceCategory" ADD VALUE 'DJ';
ALTER TYPE "ServiceCategory" ADD VALUE 'MUZICA_LIVE';
ALTER TYPE "ServiceCategory" ADD VALUE 'CATERING';
