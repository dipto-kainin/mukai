import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const upvoteSchema = z.object({
    streamId: z.string(),
});

export async function POST(req: NextRequest) {
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
    try {
        const data = upvoteSchema.parse(await req.json());
        await prismaClient.upvote.create({
            data: {
                userID: user.id,
                streamID: data.streamId,
            },
        });
        await prismaClient.stream.update({
            where: {
                id: data.streamId,
            },
            data: {
                lastUpvoted: new Date(),
            },
        });
        return NextResponse.json({
            message: "Stream upvoted",
        });
    } catch (error) {
        return NextResponse.json(
            {
                message:
                    "Error upvoting stream make sure you are not upvoting the same stream twice",
                error,
            },
            { status: 403 }
        );
    }
}
