'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Share2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function ShareButton({ creatorId }: Readonly<{ creatorId: string }>) {
    const [isCopied, setIsCopied] = useState(false);
    const { toast } = useToast();

    const handleShare = async () => {
        // Ensure the URL is correctly constructed
        const currentUrl = `${window.location.origin}/creator/${creatorId}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Song Voting Queue',
                    url: currentUrl,
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(currentUrl);
                setIsCopied(true);

                // Show success toast
                toast({
                    title: "Link Copied",
                    description: "URL has been copied to clipboard",
                    duration: 2000,
                });

                setTimeout(() => setIsCopied(false), 2000);
            } catch (error) {
                console.error('Error copying to clipboard:', error);

                // Show error toast
                toast({
                    title: "Error",
                    description: "Failed to copy link",
                    variant: "destructive",
                });
            }
        }
    };

    return (
        <Button
            onClick={handleShare}
            className="bg-purple-600 hover:bg-purple-700 text-white"
        >
            <Share2 className="w-4 h-4 mr-2" />
            {isCopied ? 'Copied!' : 'Share'}
        </Button>
    );
}
