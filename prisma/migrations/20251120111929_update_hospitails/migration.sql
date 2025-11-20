/*
  Warnings:

  - A unique constraint covering the columns `[nif]` on the table `Hospitals` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nif` to the `Hospitals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `hospitals` ADD COLUMN `nif` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Hospitals_nif_key` ON `Hospitals`(`nif`);
