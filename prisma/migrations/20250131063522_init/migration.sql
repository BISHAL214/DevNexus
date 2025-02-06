/*
  Warnings:

  - You are about to drop the column `name` on the `locations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "locations" DROP COLUMN "name",
ADD COLUMN     "state" TEXT;
