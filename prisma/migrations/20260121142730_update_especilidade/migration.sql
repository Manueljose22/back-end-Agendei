/*
  Warnings:

  - Added the required column `color` to the `Specialties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Specialties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `specialties` ADD COLUMN `color` VARCHAR(191) NOT NULL,
    ADD COLUMN `description` VARCHAR(191) NOT NULL;
