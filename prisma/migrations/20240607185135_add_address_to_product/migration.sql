/*
  Warnings:

  - Added the required column `address_tenants` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Product` ADD COLUMN `address_tenants` VARCHAR(191) NOT NULL;
