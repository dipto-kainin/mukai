/*
  Warnings:

  - You are about to drop the column `streamId` on the `currentStream` table. All the data in the column will be lost.
  - Added the required column `extractedID` to the `currentStream` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnail` to the `currentStream` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `currentStream` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `currentStream` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "currentStream" DROP CONSTRAINT "currentStream_streamId_fkey";

-- DropIndex
DROP INDEX "currentStream_streamId_key";

-- AlterTable
ALTER TABLE "currentStream" DROP COLUMN "streamId",
ADD COLUMN     "extractedID" TEXT NOT NULL,
ADD COLUMN     "thumbnail" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;
