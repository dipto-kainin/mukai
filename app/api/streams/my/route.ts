import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
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
        const streams = await prismaClient.stream.findMany({
            where: { userID: user.id },
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
        });

        // Sort the streams by the last upvoted date
        streams.sort((a, b) => {
            if (a.lastUpvoted && b.lastUpvoted) {
                return a.lastUpvoted < b.lastUpvoted ? 1 : -1;
            }
            return 0;
        });

        return NextResponse.json(
            {
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
