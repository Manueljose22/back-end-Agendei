-- AlterTable
ALTER TABLE `services` ADD COLUMN `duraction` VARCHAR(191) NULL,
    ADD COLUMN `specialtyId` VARCHAR(191) NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'activo';

-- AddForeignKey
ALTER TABLE `Services` ADD CONSTRAINT `Services_specialtyId_fkey` FOREIGN KEY (`specialtyId`) REFERENCES `Specialties`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
