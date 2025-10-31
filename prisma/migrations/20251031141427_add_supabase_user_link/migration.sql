/*
  Warnings:

  - A unique constraint covering the columns `[supabaseId]` on the table `StudentProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[supabaseId]` on the table `TeacherProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `supabaseId` to the `StudentProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supabaseId` to the `TeacherProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StudentProfile" ADD COLUMN     "supabaseId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TeacherProfile" ADD COLUMN     "supabaseId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'STUDENT';

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_supabaseId_key" ON "StudentProfile"("supabaseId");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherProfile_supabaseId_key" ON "TeacherProfile"("supabaseId");
