-- DropForeignKey
ALTER TABLE "Upvote" DROP CONSTRAINT "Upvote_streamID_fkey";

-- AddForeignKey
ALTER TABLE "Upvote" ADD CONSTRAINT "Upvote_streamID_fkey" FOREIGN KEY ("streamID") REFERENCES "Stream"("id") ON DELETE CASCADE ON UPDATE CASCADE;
