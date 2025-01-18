"use client";
import { useQueue } from "@/app/context/QueueContext";
import { Button } from "@/components/ui/button";
import React from 'react'
import ReactPlayer from 'react-player/youtube'
import { useEffect, useState } from "react";
//import { useSession } from "next-auth/react";

type Video = {
    userId: string;
    title: string;
    thumbnail: string;
    url: string;
    extractedID: string;
};

export default function CurrentlyPlaying({ playVideo, creatorId }: { playVideo: boolean; creatorId: string }) {
    const { queue } = useQueue();
    //const { data: session } = useSession();
    const [currentVideo, setCurrentVideo] = useState<Video | null>(null);

    const playnext = async () => {
        await fetch(`/api/streams/next?creatorId=` + creatorId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json().then((data) => {
            if (data.currentStream) {
                setCurrentVideo(data.currentStream);
            }
        }));
    };

    useEffect(() => {
        const fetchCurrent = async () => {
            await fetch(`/api/streams?creatorId=` + creatorId, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => res.json().then((data) => {
                if (data.currentStream && currentVideo?.extractedID !== data.currentStream.extractedID) {
                    setCurrentVideo(data.currentStream);
                }
            }));
        };
        fetchCurrent();

    });

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Now Playing</h2>
            <div className="w-full max-w-[900px] h-auto aspect-video bg-[#1a1b26]/50 rounded-lg">
                {currentVideo ? (
                    <ReactPlayer
                        url={currentVideo.url}
                        playing={true}
                        controls={true}
                        width="100%"
                        height="100%"
                        onEnded={playnext}
                    />
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
