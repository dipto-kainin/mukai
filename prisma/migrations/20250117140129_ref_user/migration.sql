-- AddForeignKey
ALTER TABLE "currentStream" ADD CONSTRAINT "currentStream_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
