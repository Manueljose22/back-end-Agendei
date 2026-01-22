/*
  Warnings:

  - You are about to alter the column `role` on the `admins` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - You are about to drop the column `password` on the `hospitals` table. All the data in the column will be lost.
  - Added the required column `hospitalId` to the `Specialties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `admins` MODIFY `role` ENUM('Admin', 'Owner') NOT NULL DEFAULT 'Owner';

-- AlterTable
ALTER TABLE `hospitals` DROP COLUMN `password`;

-- AlterTable
ALTER TABLE `specialties` ADD COLUMN `hospitalId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Specialties` ADD CONSTRAINT `Specialties_hospitalId_fkey` FOREIGN KEY (`hospitalId`) REFERENCES `Hospitals`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Hospitals` ADD CONSTRAINT `Hospitals_id_fkey` FOREIGN KEY (`id`) REFERENCES `Admins`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
