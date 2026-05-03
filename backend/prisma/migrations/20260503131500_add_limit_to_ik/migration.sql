/*
  Warnings:

  - You are about to drop the column `address` on the `users` table. All the data in the column will be lost.
  - You are about to alter the column `nik` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(24)`.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "address",
ALTER COLUMN "nik" SET DATA TYPE VARCHAR(24);
