"use client";
import { SessionProvider } from "next-auth/react";
import { QueueProvider } from '@/app/context/QueueContext';
import { CurrentlyPlayingProvider } from "./context/CurrentPlayingContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <QueueProvider>
                <CurrentlyPlayingProvider>
                    {children}
                </CurrentlyPlayingProvider>
            </QueueProvider>
        </SessionProvider>
    );
}