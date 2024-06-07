/*
  Warnings:

  - Added the required column `location_lat` to the `Tenants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location_lng` to the `Tenants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Tenants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Tenants` ADD COLUMN `location_lat` DOUBLE NOT NULL,
    ADD COLUMN `location_lng` DOUBLE NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Users` ALTER COLUMN `updated_at` DROP DEFAULT;
