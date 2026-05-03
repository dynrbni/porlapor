/*
  Warnings:

  - You are about to drop the column `agencyId` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the `agencies` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_agencyId_fkey";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "agencyId";

-- DropTable
DROP TABLE "agencies";
