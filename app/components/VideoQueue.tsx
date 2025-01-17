"use client";
import { useEffect } from 'react';
import { ArrowBigUp, ArrowBigDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { useQueue } from '@/app/context/QueueContext';
import { useCurrent } from '../context/CurrentPlayingContext';

export default function VideoQueue({ creatorId }: Readonly<{ creatorId: string }>) {
    const { queue, setQueue } = useQueue();
    const { current, setCurrent } = useCurrent();

    const refreshStreams = async () => {
        try {
            const response = await fetch('/api/streams/?creatorId=' + creatorId);
            if (response.ok) {
                const data = await response.json();
                setQueue(data.streams);
                if (current === null) {
                    setCurrent(data.currentStream);
                }
            } else {
                console.error('Failed to fetch streams:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching streams:', error);
        }
    };

    useEffect(() => {
        refreshStreams();
        const interval = setInterval(refreshStreams, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleVote = async (id: string, increment: number) => {
        const video = queue.find((v) => v.id === id);
        if (!video || (increment === 1 && video.haveUpvoted) || (increment === -1 && !video.haveUpvoted)) {
            alert('Invalid vote action.');
            return;
        }

        setQueue((prevQueue) =>
            prevQueue
                .map((v) =>
                    v.id === id
                        ? { ...v, upvotes: v.upvotes + increment, haveUpvoted: increment === 1 }
                        : v
                )
                .sort((a, b) => b.upvotes - a.upvotes)
        );

        const endpoint = increment === 1 ? '/api/streams/upvote' : '/api/streams/downvote';
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ streamId: id }),
            });
            if (!response.ok) throw new Error('Failed to update vote.');
        } catch (error) {
            console.error(error);
            setQueue((prevQueue) =>
                prevQueue
                    .map((v) =>
                        v.id === id
                            ? {
                                ...v,
                                upvotes: v.upvotes - increment,
                                haveUpvoted: increment === 1 ? false : v.haveUpvoted,
                            }
                            : v
                    )
                    .sort((a, b) => b.upvotes - a.upvotes)
            );
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Upcoming Songs</h2>
            <div className="space-y-2">
                {queue.map((video) => (
                    <div key={video.id} className="flex items-center gap-4 p-4 bg-[#1a1b26]/50 rounded-lg">
                        <div className="flex flex-col items-center gap-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                className={`${video.haveUpvoted ? 'bg-gray-500' : 'bg-purple-600 hover:bg-purple-700'
                                    } text-white p-0 h-8 w-8`}
                                disabled={video.haveUpvoted}
                                onClick={() => handleVote(video.id, 1)}
                            >
                                <ArrowBigUp className="w-6 h-6" />
                            </Button>
                            <span className="text-white font-bold">{video.upvotes}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                className={`${!video.haveUpvoted ? 'bg-gray-500' : 'bg-purple-600 hover:bg-purple-700'
                                    } text-white p-0 h-8 w-8`}
                                disabled={!video.haveUpvoted}
                                onClick={() => handleVote(video.id, -1)}
                            >
                                <ArrowBigDown className="w-6 h-6" />
                            </Button>
                        </div>
                        <div className="relative w-80 h-60 flex-shrink-0">
                            <Image src={video.thumbnail} alt={video.title} fill className="rounded object-cover" />
                        </div>
                        <div className="flex-grow">
                            <h3 className="text-white font-medium">{video.title}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
