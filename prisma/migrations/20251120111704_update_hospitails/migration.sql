/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Hospitals` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `Hospitals` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `hospitals` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `hospitals` ADD COLUMN `password` VARCHAR(191) NOT NULL,
    MODIFY `email` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Hospitals_email_key` ON `Hospitals`(`email`);
