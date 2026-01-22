/*
  Warnings:

  - You are about to drop the `admins` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `password` to the `Hospitals` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `hospitals` DROP FOREIGN KEY `Hospitals_id_fkey`;

-- AlterTable
ALTER TABLE `hospitals` ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `role` ENUM('admin', 'owner', 'doctor') NOT NULL DEFAULT 'admin';

-- DropTable
DROP TABLE `admins`;
