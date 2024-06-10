/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Users` DROP COLUMN `phoneNumber`,
    ADD COLUMN `phone` VARCHAR(191) NULL;
