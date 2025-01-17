/*
  Warnings:

  - You are about to drop the column `upvotedAt` on the `Upvote` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Stream" ADD COLUMN     "lastUpvoted" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Upvote" DROP COLUMN "upvotedAt";
