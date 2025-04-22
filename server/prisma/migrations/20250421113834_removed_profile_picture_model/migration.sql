/*
  Warnings:

  - You are about to drop the column `profilePictureId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `ProfilePicture` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_profilePictureId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "profilePictureId";

-- DropTable
DROP TABLE "ProfilePicture";
