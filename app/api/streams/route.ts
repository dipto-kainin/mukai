import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prismaClient } from "@/app/lib/db";
import axios from "axios";
import { getServerSession } from "next-auth";

const youtubeUrlRegex =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

// Zod schema for input validation
const createStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string().url(),
});

// Function to fetch YouTube video details
async function fetchYouTubeVideoDetails(videoId: string) {
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY; // Set your YouTube Data API key in .env
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=snippet`;

    const response = await axios.get(apiUrl);

    if (response.data.items.length === 0) {
        throw new Error("No video details found for the given ID.");
    }

    const snippet = response.data.items[0].snippet;

    return {
        title: snippet.title,
        thumbnail: snippet.thumbnails.high.url, // Use high-resolution thumbnail
    };
}

// POST handler to create a new stream
export async function POST(req: NextRequest) {
    try {
        const data1 = await req.json();
        console.log(data1);

        const data = createStreamSchema.parse(data1);
        const isYoutubeUrl = youtubeUrlRegex.test(data.url);

        if (!isYoutubeUrl) {
            return NextResponse.json(
                { message: "Invalid YouTube URL" },
                { status: 400 }
            );
        }

        const videoIdMatch = data.url.match(youtubeUrlRegex);
        const videoId = videoIdMatch ? videoIdMatch[1] : null;

        if (!videoId) {
            return NextResponse.json(
                { message: "Could not extract YouTube video ID" },
                { status: 400 }
            );
        }

        // Fetch video details
        const { title, thumbnail } = await fetchYouTubeVideoDetails(videoId);

        // Save stream in the database
        const stream = await prismaClient.stream.create({
            data: {
                userID: data.creatorId,
                type: "Youtube",
                ExtractedID: videoId as string,
                url: data.url,
                title: title as string,
                thumbnail: thumbnail as string,
            },
        });

        return NextResponse.json(
            {
                message: "Stream created successfully",
                id: stream.id,
                title,
                thumbnail,
            },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                message: "Error creating stream",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

// GET handler to fetch streams by creatorId
export async function GET(req: NextRequest) {
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
    const { searchParams } = new URL(req.url);
    const creatorId = searchParams.get("creatorId");

    if (!creatorId) {
        return NextResponse.json(
            { message: "creatorId is required" },
            { status: 400 }
        );
    }

    try {
        const [currentStream, streams] = await Promise.all([
            prismaClient.currentStream.findFirst({
                where: { userId: creatorId },
            }),
            prismaClient.stream.findMany({
                where: { userID: creatorId },
                include: {
                    _count: {
                        select: { upvotes: true },
                    },
                    upvotes: {
                        where: {
                            userID: user.id,
                        },
                    },
                },
                orderBy: [
                    { upvotes: { _count: "desc" } }, // Sort by upvotes count in descending order
                    { lastUpvoted: "asc" }, // If counts are equal, sort by lastUpvoted in descending order
                ],
            }),
        ]);

        return NextResponse.json(
            {
                currentStream: currentStream,
                streams: streams.map(({ _count, ...rest }) => {
                    return {
                        ...rest,
                        upvotes: _count.upvotes,
                        haveUpvoted: rest.upvotes.length ? true : false,
                    };
                }),
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                message: "Error fetching streams",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
//delete handeller to delete a stream by id
export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const streamId = searchParams.get("id");

    if (!streamId) {
        return NextResponse.json(
            { message: "streamId is required" },
            { status: 400 }
        );
    }

    try {
        console.log(streamId);
        console.log("Stream ID:", streamId); // Add this log to check the streamId before deletion

        const stream = await prismaClient.stream.delete({
            where: { id: streamId },
        });
        console.log(stream);

        return NextResponse.json(stream, { status: 200 });
    } catch (error) {
        //console.log(error);

        return NextResponse.json(
            {
                message: "Error deleting stream",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
