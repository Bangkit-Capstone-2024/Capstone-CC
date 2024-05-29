/*
  Warnings:

  - You are about to alter the column `token` on the `TokenBlacklist` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE `TokenBlacklist` MODIFY `token` VARCHAR(100) NOT NULL;
