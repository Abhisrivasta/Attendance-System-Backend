/*
  Warnings:

  - Added the required column `collegeId` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Batch" DROP CONSTRAINT "Batch_collegeId_fkey";

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "collegeId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
