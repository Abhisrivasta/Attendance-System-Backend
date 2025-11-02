-- CreateEnum
CREATE TYPE "CollegeType" AS ENUM ('GOVERNMENT', 'PRIVATE', 'AUTONOMOUS');

-- AlterTable
ALTER TABLE "College" ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "establishedYear" INTEGER,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "type" "CollegeType";
