import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const creatorId = searchParams.get("creatorId");
    const session = await getServerSession();
    const user = await prismaClient.user.findFirst({
        where: {
            email: session?.user?.email as string,
        },
    });
    if (!user) {
        return NextResponse.json(
            {
                message: "Unauthorized",
            },
            {
                status: 403,
            }
        );
    }
    if (!creatorId && user.id !== creatorId) {
        return NextResponse.json(
            { message: "creatorId invalid or you are not the creator" },
            { status: 400 }
        );
    }

    try {
        const mostRecentStreams = await prismaClient.stream.findFirst({
            where: { userID: user.id },
            orderBy: [
                { upvotes: { _count: "desc" } }, // Sort by upvotes count in descending order
                { lastUpvoted: "asc" }, // If counts are equal, sort by lastUpvoted in descending order
            ],
        });
        console.log(mostRecentStreams?.id);

        const [currentStream, deleted] = await Promise.all([
            prismaClient.currentStream.upsert({
                where: { userId: user.id },
                update: {
                    thumbnail: mostRecentStreams?.thumbnail,
                    title: mostRecentStreams?.title,
                    extractedID: mostRecentStreams?.ExtractedID,
                    url: mostRecentStreams?.url,
                },
                create: {
                    userId: user.id,
                    thumbnail: mostRecentStreams?.thumbnail as string,
                    title: mostRecentStreams?.title as string,
                    extractedID: mostRecentStreams?.ExtractedID as string,
                    url: mostRecentStreams?.url as string,
                },
            }),
            prismaClient.stream.delete({
                where: {
                    id: mostRecentStreams?.id,
                },
            }),
        ]);
        console.log("deleted from queue", deleted);

        return NextResponse.json(
            {
                stream: currentStream,
            },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            {
                message: "Error fetching streams",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
