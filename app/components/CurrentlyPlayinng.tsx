"use client";
import { useQueue } from "@/app/context/QueueContext";
import { Button } from "@/components/ui/button";
//@ts-expect-error @ts-ignore
import YouTubePlayer from "youtube-player";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

type Video = {
    userId: string;
    title: string;
    thumbnail: string;
    url: string;
    extractedID: string;
};

export default function CurrentlyPlaying({ playVideo, creatorId }: { playVideo: boolean; creatorId: string }) {
    const { queue } = useQueue();
    const { data: session } = useSession();
    const VideoRef = useRef<HTMLDivElement | null>(null);
    const playerInitialized = useRef(false); // Track if player is initialized
    const [player, setPlayer] = useState<YouTubePlayer | null>(null);
    const [currentVideo, setCurrentVideo] = useState<Video | null>(null);

    const playnext = useCallback(async () => {
        if (!session?.user || session.user.id !== creatorId) {
            console.error("Unauthorized to play next video");
            return;
        }
        console.log("Playing next video");

        if (player) {
            player.destroy(); // Destroy the current player instance
            setPlayer(null); // Reset the player reference
        }

        const response = await fetch("/api/streams/next?creatorId=" + creatorId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const data = await response.json();
            setCurrentVideo(data.stream); // Set the new video after destroying the previous player
        }

    }, [session?.user, creatorId, player]);

    useEffect(() => {
        const fetchStreams = async () => {
            const response = await fetch("/api/streams?creatorId=" + creatorId, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                const newVideo = data.currentStream;

                if (!currentVideo || (newVideo && newVideo.extractedID !== currentVideo?.extractedID)) {
                    setCurrentVideo(newVideo);
                }
            }
        };

        const initializePlayer = () => {
            if (!VideoRef.current || playerInitialized.current) return;

            const newPlayer = YouTubePlayer(VideoRef.current);
            setPlayer(newPlayer);
            playerInitialized.current = true;

            const onEndEvent = (event: { data: number }) => {
                if (event.data === 0) {
                    playnext(); // Call playnext when the video ends
                }
            };

            newPlayer.on("stateChange", onEndEvent);
        };

        const handleQueueAndVideo = async () => {
            await fetchStreams();

            if (!currentVideo && queue.length > 0) {
                await playnext(); // Play next if no current video and queue is available
            }
        };

        handleQueueAndVideo();

        const intervalId = setInterval(() => {
            fetchStreams();
        }, 1000);

        initializePlayer();

        return () => {
            clearInterval(intervalId); // Cleanup interval
        };
    }, [creatorId, currentVideo, queue, playnext, session?.user]);

    useEffect(() => {
        if (currentVideo?.extractedID && player) {
            player.loadVideoById(currentVideo.extractedID); // Load the new video

            console.log(currentVideo);
            player.playVideo(); // Explicitly play the new video
        }
    }, [currentVideo, player]);

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Now Playing</h2>
            <div className="w-full max-w-[900px] h-auto aspect-video bg-[#1a1b26]/50 rounded-lg">
                {currentVideo ? (
                    <div ref={VideoRef} className="w-full h-full" />
                ) : (
                    <p className="text-gray-400">No video playing</p>
                )}
            </div>
            {playVideo && (
                <Button
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={playnext}
                    disabled={queue.length === 0}
                >
                    Play Next
                </Button>
            )}
        </div>
    );
}
