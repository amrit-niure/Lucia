/*
  Warnings:

  - You are about to drop the column `remarks` on the `SkillsAssessment` table. All the data in the column will be lost.
  - You are about to drop the column `overseer` on the `VisaApplication` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "JobReadyProgram" ADD COLUMN     "totalAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "totalPaid" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE "SkillsAssessment" DROP COLUMN "remarks",
ADD COLUMN     "totalAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "totalPaid" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE "VisaApplication" DROP COLUMN "overseer";
