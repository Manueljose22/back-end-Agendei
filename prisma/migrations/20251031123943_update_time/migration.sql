/*
  Warnings:

  - You are about to drop the column `available` on the `timetables_appointments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `availabilities` ADD COLUMN `isBlocked` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `doctors` MODIFY `status` VARCHAR(191) NULL DEFAULT 'activo';

-- AlterTable
ALTER TABLE `timetables_appointments` DROP COLUMN `available`,
    ADD COLUMN `isBooked` BOOLEAN NOT NULL DEFAULT false;
