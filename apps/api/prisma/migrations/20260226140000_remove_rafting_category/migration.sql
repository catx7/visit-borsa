-- Convert any existing RAFTING services to OTHER
UPDATE "Service" SET "category" = 'OTHER' WHERE "category" = 'RAFTING';

-- Remove RAFTING from the ServiceCategory enum
ALTER TYPE "ServiceCategory" RENAME TO "ServiceCategory_old";
CREATE TYPE "ServiceCategory" AS ENUM ('ATV', 'SNOWMOBILE', 'HORSEBACK_RIDING', 'HIKING', 'SKIING', 'BICYCLE_RENTAL', 'TAXI_LOCAL', 'RENT_A_CAR', 'FOTOGRAF', 'INSTALATOR', 'ELECTRICIAN', 'TRANSPORT_MARFA', 'DESZAPEZIRE', 'MASAJ', 'INSTRUCTOR_FITNESS', 'DJ', 'MUZICA_LIVE', 'CATERING', 'OTHER');
ALTER TABLE "Service" ALTER COLUMN "category" TYPE "ServiceCategory" USING ("category"::text::"ServiceCategory");
DROP TYPE "ServiceCategory_old";
