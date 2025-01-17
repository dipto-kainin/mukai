import React, { useEffect, useRef } from 'react';

interface VideoPlayerProps {
    videoId: string; // The YouTube video ID
    onVideoEnd: () => void; // Function to call when the video ends
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, onVideoEnd }) => {
    const playerRef = useRef<YT.Player | null>(null);

    useEffect(() => {
        const loadYouTubeAPI = () => {
            if (!window.YT) {
                const script = document.createElement('script');
                script.src = 'https://www.youtube.com/iframe_api';
                script.async = true;
                script.onload = () => initializePlayer();
                document.body.appendChild(script);
            } else {
                initializePlayer();
            }
        };

        const initializePlayer = () => {
            if (playerRef.current) {
                playerRef.current.destroy();
            }

            playerRef.current = new window.YT.Player('player', {
                videoId,
                events: {
                    onStateChange: handlePlayerStateChange,
                },
            });
        };

        const handlePlayerStateChange = (event: YT.OnStateChangeEvent) => {
            // Only trigger on video end
            if (event.data === window.YT.PlayerState.ENDED) {
                onVideoEnd();
            }

            // Log player states for debugging
            console.log('Player state:', event.data);

            // Make sure we don't unintentionally pause the video
            if (event.data === window.YT.PlayerState.PAUSED) {
                console.log('Video paused unexpectedly');
            }
        };

        loadYouTubeAPI();

        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null;
            }
        };
    }, [videoId, onVideoEnd]);

    return (
        <div className="w-full max-w-[900px] h-auto aspect-video bg-[#1a1b26]/50 rounded-lg">
            <div id="player" className="w-full h-full"></div>
        </div>
    );
};

export default VideoPlayer;
