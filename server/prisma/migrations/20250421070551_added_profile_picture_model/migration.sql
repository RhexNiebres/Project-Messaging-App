-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profilePictureId" INTEGER;

-- CreateTable
CREATE TABLE "ProfilePicture" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "ProfilePicture_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_profilePictureId_fkey" FOREIGN KEY ("profilePictureId") REFERENCES "ProfilePicture"("id") ON DELETE SET NULL ON UPDATE CASCADE;
