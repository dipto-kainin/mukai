'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function VideoSubmission({ creatorId }: Readonly<{ creatorId: string }>) {
    const [videoUrl, setVideoUrl] = useState('')
    const [loader, setLoader] = useState(false) // Replace with actual user ID
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle submission
        setLoader(true)
        fetch('/api/streams', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                creatorId: creatorId,
                url: videoUrl
            })
        }).catch((error) => {
            console.error('Error submitting video:', error)
        }).finally(() => {
            setTimeout(() => {
                setLoader(false)
                setVideoUrl('')
            }, 1000)
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <Input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Paste YouTube link here"
                className="bg-[#1a1b26]/50 border-none text-white placeholder:text-gray-400"
            />
            <Button
                disabled={loader}
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
                Add to Queue
            </Button>
        </form>
    )
}

