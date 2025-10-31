/*
  Warnings:

  - You are about to drop the column `data` on the `availabilities` table. All the data in the column will be lost.
  - Added the required column `date` to the `availabilities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `availabilities` DROP COLUMN `data`,
    ADD COLUMN `date` DATETIME(3) NOT NULL;
