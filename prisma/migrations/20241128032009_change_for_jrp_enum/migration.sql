/*
  Warnings:

  - The values [JRPRE] on the enum `JRPStage` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "JRPStage_new" AS ENUM ('PSA', 'JRE', 'JRWA', 'JRFA');
ALTER TABLE "JobReadyProgram" ALTER COLUMN "stage" TYPE "JRPStage_new" USING ("stage"::text::"JRPStage_new");
ALTER TYPE "JRPStage" RENAME TO "JRPStage_old";
ALTER TYPE "JRPStage_new" RENAME TO "JRPStage";
DROP TYPE "JRPStage_old";
COMMIT;

-- AlterEnum
ALTER TYPE "VisaType" ADD VALUE 'SUB_485';
