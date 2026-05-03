/*
  Warnings:

  - A unique constraint covering the columns `[nik]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "address" TEXT,
ADD COLUMN     "birthDate" DATE,
ADD COLUMN     "nik" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_nik_key" ON "users"("nik");
