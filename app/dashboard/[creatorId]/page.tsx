"use client"

import CurrentlyPlaying from '@/app/components/CurrentlyPlayinng'
import VideoQueue from '@/app/components/VideoQueue'
import VideoSubmission from '@/app/components/VideoSubmission'
import ShareButton from '@/app/components/Sharebutton'
import { Toaster } from '@/components/ui/toaster'
import { useParams } from 'next/navigation'
import { Navbar } from '@/app/components/Appbar'

export default function Home() {
    // fetch params from the URL
    const { creatorId } = useParams();
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a1b26] via-[#4a1d96] to-[#581c87] p-6">
            <Navbar />
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white">Song Voting Queue</h1>
                    <ShareButton />
                </div>
                <CurrentlyPlaying playVideo={true} creatorId={creatorId as string} />
                {creatorId && <VideoQueue creatorId={creatorId as string} />}
                <VideoSubmission creatorId={creatorId as string} />
            </div>
            <Toaster />
        </div>
    )
}

