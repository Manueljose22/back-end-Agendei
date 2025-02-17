/*
  Warnings:

  - Added the required column `price` to the `Doctors_Services` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `doctors_services` ADD COLUMN `price` DOUBLE NOT NULL;
