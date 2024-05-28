/*
  Warnings:

  - You are about to drop the column `verified` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Users` DROP COLUMN `verified`,
    ADD COLUMN `isVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `verificationToken` VARCHAR(191) NULL;
