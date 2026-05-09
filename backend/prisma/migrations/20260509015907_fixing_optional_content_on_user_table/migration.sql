/*
  Warnings:

  - Made the column `phone` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nik` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gender` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "nik" SET NOT NULL,
ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "gender" SET NOT NULL;
